const express = require('express');
const {createTransaction, fetchTransaction, removeTransaction, editTransaction} = require('../controllers/transactionController')
const {protect} = require('../middleware/authMiddleware')

const router = express.Router();

router.post('/',protect,createTransaction);
router.get('/',protect,fetchTransaction);
router.put('/:id',protect,editTransaction);
router.delete('/:id',protect,removeTransaction);

module.exports = router;