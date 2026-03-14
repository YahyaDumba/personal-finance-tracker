const { get } = require('../app');
const {pool} = require('../config/db');

const createCategory = async(userId, name, type) => {
    const [result] = await pool.query (
        'INSERT INTO categories(userId, name, type) VALUES (?, ?, ?)', [userId, name, type]
    );

    return {categoryId: result.insertId};
}

const getCategories = async(userId) => {
    const [rows] = await pool.query (
        'SELECT * FROM categories WHERE userId = ?', [userId]
    );

    return rows;
}

module.exports = {createCategory, getCategories};