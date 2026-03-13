const express = require('express');
const {createOrUpdateBudget, fetchBudgets, removeBudget} = require('../controllers/budgetController');
const {project, protect} = require('../middleware/authMiddleware');
const { deleteBudget } = require('../services/budgetService');

const router = express.Router();

router.post('/', protect, createOrUpdateBudget);
router.get('/', protect, fetchBudgets);
router.delete('/:id', protect, removeBudget)

module.exports = router;