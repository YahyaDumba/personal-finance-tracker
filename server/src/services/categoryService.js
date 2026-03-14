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

const deleteCategory = async (userId, categoryId) => {
    const [result] = await pool.query(
        'DELETE FROM categories WHERE id = ? AND userId = ?',
        [categoryId, userId]
    );
    if (result.affectedRows === 0) {
        throw new Error('Category not found');
    }
    return true;
};

module.exports = {createCategory, getCategories, deleteCategory};