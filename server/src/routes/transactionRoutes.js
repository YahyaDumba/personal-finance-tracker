const express = require('express');
const {createTransaction, fetchTransactions, removeTransaction, editTransaction} = require('../controllers/transactionController')
const {protect} = require('../middleware/authMiddleware')

const router = express.Router();

router.post('/',protect,createTransaction);
router.get('/',protect,fetchTransactions);
router.put('/:id',protect,editTransaction);
router.delete('/:id',protect,removeTransaction);

module.exports = router;