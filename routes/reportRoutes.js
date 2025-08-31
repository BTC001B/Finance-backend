const express = require('express');
const router = express.Router();

// ✅ Get overall performance report
router.get('/performance', (req, res) => {
  res.json({
    message: 'Performance report generated',
    report: {
      totalInvestment: 50000,
      currentValue: 75000,
      profitLoss: 25000,
      profitLossPercent: 50
    }
  });
});

// ✅ Get trade history report
router.get('/trade-history', (req, res) => {
  res.json({
    message: 'Trade history fetched',
    trades: [
      { symbol: 'AAPL', type: 'BUY', quantity: 10, price: 150, date: '2025-08-01' },
      { symbol: 'TSLA', type: 'SELL', quantity: 3, price: 780, date: '2025-08-03' }
    ]
  });
});

module.exports = router;
