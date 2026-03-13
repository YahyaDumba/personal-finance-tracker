const { addTransaction, getTransaction, deleteTransaction, updateTransaction } = require('../services/transactionService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const createTransaction = async (req, res) => {
    const { categoryId, type, amount, description, frequency, transactionDate } = req.body;
    const userId = req.user.id;

    if (!type || !amount || !transactionDate) {
        return errorResponse(res, 400, 'Type, Amount and Date are required');
    }

    if (!['expense', 'income'].includes(type)) {
        return errorResponse(res, 400, 'Type must be expense or income');
    }

    if (amount <= 0) {
        return errorResponse(res, 400, 'Amount must be greater than 0');
    }

    try {
        const data = await addTransaction(
            userId, categoryId, type, amount, description, frequency, transactionDate
        );

        return successResponse(res, 201, 'Transaction created successfully', data);
    } catch (error) {
        return errorResponse(res, 500, 'Server Error');
    }
};

const fetchTransaction = async (req, res) => {
    const userId = req.user.id;
    const { type, startDate, endDate } = req.query;

    try {
        const data = await getTransaction(
            userId, type, startDate, endDate
        );

        return successResponse(res, 200, 'Transaction fetched successfully', data);
    } catch (error) {
        return errorResponse(res, 500, 'Server Error');
    }
};

const removeTransaction = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    try {
        await deleteTransaction(
            userId, id
        );

        return successResponse(res, 200, 'Transaction deleted successfully');
    } catch (error) {
        if (error.message === 'Transaction Not Found') {
            return errorResponse(res, 404, 'Transaction not found');
        }
        return errorResponse(res, 500, 'Server Error');
    }
};

const editTransaction = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    try {
        await updateTransaction(
            userId, id, req.body
        );

        return successResponse(res, 200, 'Transaction updated successfully');
    } catch (error) {
        return errorResponse(res, 500, 'Server Error');
    }
};

module.exports = { createTransaction, fetchTransaction, removeTransaction, editTransaction };
