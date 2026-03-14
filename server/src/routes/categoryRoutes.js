const express = require('express');
const {addCategory, fetchCategories} = require('../controllers/categoryController');
const {protect} = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, addCategory);
router.get('/', protect, fetchCategories)

module.exports = router;