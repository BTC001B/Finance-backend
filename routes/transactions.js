const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// 💰 Get all transactions
router.get('/', transactionController.getAllTransactions);

module.exports = router;
