const { pool } = require('../config/db');

const setBudget = async (userId, categoryId, monthlyLimit, month, year) => {
    // Check if budget already exists for this category/month/year
    const [existing] = await pool.query(
        'SELECT id FROM budgets WHERE userId = ? AND categoryId = ? AND month = ? AND year = ?', [userId, categoryId, month, year]
    );

    if (existing.length > 0) {
        //Update existing budget
        await pool.query(
            'UPDATE budgets SET monthlyLimit = ? WHERE userId = ? AND categoryId = ? AND month = ? AND year = ?', [monthlyLimit, userId, categoryId, month, year]
        );

        return { updated: true };
    }

    // Create new budgetr
    const [result] = await pool.query(
        'INSERT INTO budgets (userId, categoryId, monthlyLimit, month, year) VALUES (?, ?, ?, ?, ?)', [userId, categoryId, monthlyLimit, month, year]
    );
    return { budgetId: result.insertId };
}

const getBudgets = async (userId, month, year) => {
    const [rows] = await pool.query(
        `SELECT b.*, c.name AS categoryName,
     COALESCE(SUM(t.amount), 0) AS spent,
     ROUND((COALESCE(SUM(t.amount), 0) / b.monthlyLimit) * 100, 2) AS percentageUsed
     FROM budgets b
     JOIN categories c ON b.categoryId = c.id
     LEFT JOIN transactions t ON t.categoryId = b.categoryId
       AND t.userId = b.userId
       AND MONTH(t.transactionDate) = b.month
       AND YEAR(t.transactionDate) = b.year
       AND t.type = 'expense'
     WHERE b.userId = ? AND b.month = ? AND b.year = ?
     GROUP BY b.id`,
        [userId, month, year]
    );
    return rows;
}

const deleteBudget = async (userId, budgetId) => {
    const [existing] = await pool.query(
        'SELECT id FROM budgets WHERE id = ? AND userId = ?', [budgetId, userId]
    );

    if(existing.length == 0){
        throw new Error('Budget Not Found');
    }

    await pool.query('DELETE FROM budgets WHERE id = ?', [budgetId]);
    return true;
}

module.exports = {setBudget, getBudgets, deleteBudget};