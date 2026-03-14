const express = require('express');
const {addCategory, fetchCategories, removeCategory} = require('../controllers/categoryController');
const {protect} = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, addCategory);
router.get('/', protect, fetchCategories);
router.delete('/:id', protect, removeCategory);

module.exports = router;