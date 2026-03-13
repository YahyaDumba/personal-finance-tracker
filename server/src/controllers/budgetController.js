const { setBudget, getBudgets, deleteBudget } = require('../services/budgetService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const createOrUpdateBudget = async (req, res) => {
    const { categoryId, monthlyLimit, month, year } = req.body;
    const userId = req.user.id;

    if (!categoryId || !monthlyLimit || !month || !year) {
        return errorResponse(res, 400, 'All fields are required');
    }

    if (monthlyLimit <= 0) {
        return errorResponse(res, 400, 'Monthly limit must be greater than 0');
    }

    if (month < 1 || month > 12) {
        return errorResponse(res, 400, 'Month must be between 1 and 12');
    }

    try {
        const data = await setBudget(userId, categoryId, monthlyLimit, month, year);
        return successResponse(res, 201, 'Budget saved successfully', data);
    } catch (error) {
        console.log('BUDGET ERROR:', error.message);
        return errorResponse(res, 500, 'Server error');
    }
}

const fetchBudgets = async (req, res) => {
    const userId = req.user.id;
    const { month, year } = req.query;

    if (!month || !year) {
        return errorResponse(res, 400, 'Month and year are required');
    }

    try {
        const data = await getBudgets(userId, month, year);
        return successResponse(res, 200, 'Budgets fetched successfully', data);
    } catch (error) {
        console.log('FETCH BUDGET ERROR:', error.message);
        return errorResponse(res, 500, 'Server error');
    }
};

const removeBudget = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    try {
        await deleteBudget(userId, id);
        return successResponse(res, 200, 'Budget deleted successfully');
    } catch (error) {
        console.log(error.message)
        if (error.message === 'Budget Not Found') {
            return errorResponse(res, 404, 'Budget not found');
        }
        return errorResponse(res, 500, 'Server error');
    }
};

module.exports = { createOrUpdateBudget, fetchBudgets, removeBudget };