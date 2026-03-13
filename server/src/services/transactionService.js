const { pool } = require('../config/db')

const addTransaction = async (userId, categoryId, type, amount, description, frequency, transactionDate) => {
    const [result] = await pool.query(
        `INSERT INTO transactions (userId, categoryId, type, amount, description, frequency, transactionDate) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, categoryId, type, amount, description, frequency, transactionDate]);
    return { transactionId: result.insertId };
};

const getTransaction = async (userId, type, startDate, endDate) => {
    const [rows] = await pool.query(
        'CALL GetTransactionHistory (?, ?, ?, ?)',
        [userId, type || null, startDate || null, endDate || null]);
    return rows[0];
};

const deleteTransaction = async (userId, transactionId) => {
    const [existing] = await pool.query(
        'SELECT id FROM transactions WHERE id = ? AND userId = ?',
        [transactionId, userId]);

    if (existing.length == 0) {
        throw new Error('Transaction Not Found')
    }

    await pool.query('DELETE FROM transactions WHERE id=?', [transactionId]);
    return true;
}

const updateTransaction = async (userId, transactionId, fields) => {
    const [existing] = await pool.query(
        'SELECT id FROM transactions WHERE id = ? AND userId = ?',
        [transactionId, userId]);

    if (existing.length == 0) {
        throw new Error('Transaction Not Found')
    }

    const { categoryId, type, amount, description, frequency, transactionDate } = fields;
    await pool.query(`UDPATE transactions SET categoryId=?, type=?, amount=?, description=?, frequency=?, transactionDate=? 
     WHERE id = ? AND userId = ?`, [categoryId, type, amount, description, frequency, transactionDate, transactionId, userId]);
    return true;
}

module.exports = {addTransaction, getTransaction, deleteTransaction, updateTransaction}