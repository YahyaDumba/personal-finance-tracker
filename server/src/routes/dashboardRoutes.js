const express = require('express');
const {fetchDashboard} = require('../controllers/dashboardController');
const {protect} = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, fetchDashboard);

module.exports = router;