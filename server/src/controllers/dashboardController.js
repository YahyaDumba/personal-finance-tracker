const {getDashboardSummary, getMonthlySummary, getRecentTransactions} = require('../services/dashboardService');
const {successResponse, errorResponse} = require('../utils/apiResponse');

const fetchDashboard = async (req, res) => {
    const userId = req.user.id;
    const month = req.query.month || new Date().getMonth() + 1;
    const year = req.query.year || new Date().getFullYear();
    
    try {
        const [summary, monthlySummary, recentTransactions] = await Promise.all([
            getDashboardSummary(userId, month, year),
            getMonthlySummary(userId, month, year),
            getRecentTransactions(userId)
        ]);


        return successResponse(res, 200, 'Dashboard data fetched successfully', {
            summary, monthlySummary, recentTransactions
        })
    } catch (error) {
        console.log('Dashbaord Error', error.message);
        return errorResponse(res, 500, 'Server Error');
    }
}

module.exports = { fetchDashboard };