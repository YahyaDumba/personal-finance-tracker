const { pool } = require('../config/db');

const getDashboardSummary = async(userId, month, year) => {
    // Using SP
    const [rows] = await pool.query(
        'CALL GetDashboardSummary(?, ?, ?)', [userId, month, year]
    );
    return rows[0][0];
}

const getMonthlySummary = async (userId, month, year) => {
    const [rows] = await pool.query(
        'CALL getMonthlySummary(?, ?, ?)', [userId, month, year]
    );
    return rows[0];
}

const getRecentTransactions = async (userId) => {
    const [rows] = await pool.query(
        `SELECT t.*, c.name AS categoryName 
        FROM transactions t
        LEFT JOIN categories c ON t.categoryId = c.id
        WHERE t.userId = ?
        ORDER BY t.createdAt DESC
        LIMIT 5`, [userId]
    );
    return rows;
}

module.exports = {getDashboardSummary, getMonthlySummary,getRecentTransactions};