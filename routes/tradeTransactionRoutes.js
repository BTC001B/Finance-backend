const express = require('express');
const router = express.Router();
const tradeTransactionController = require('../controllers/tradeTransactionController');

router.post('/buy', tradeTransactionController.buyStock);
router.post('/sell', tradeTransactionController.sellStock);

module.exports = router;
