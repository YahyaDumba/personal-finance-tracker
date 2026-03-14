const { createCategory, getCategories } = require('../services/categoryService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const addCategory = async (req, res) => {
    const { name, type } = req.body;
    const userId = req.user.id;

    if (!name || !type) {
        return errorResponse(res, 400, 'Name and type are required');
    }

    if (!['expense', 'income'].includes(type)) {
        return errorResponse(res, 400, 'Must be expense or income');
    }

    try {
        const data = await createCategory(userId, name, type);
        return successResponse(res, 200, 'Categories created successfully', data)
    } catch (error) {
        return errorResponse(res, 500, 'Server error');
    }
}

const fetchCategories = async (req, res) => {
    const userId = req.user.id;
    try {
        const data = await getCategories(userId);
        return successResponse(res, 200, 'Categories fetched successfully', data);
    } catch (error) {
        return errorResponse(res, 500, 'Server Error');
    }
}

module.exports = { addCategory, fetchCategories };