const express = require('express');
const router = express.Router();

// ✅ Get user portfolio
router.get('/', (req, res) => {
  res.json({
    message: 'Portfolio fetched successfully',
    portfolio: [
      { symbol: 'AAPL', quantity: 10, avgBuyPrice: 150.0, currentPrice: 170.0 },
      { symbol: 'TSLA', quantity: 5, avgBuyPrice: 650.0, currentPrice: 780.0 },
      { symbol: 'BTC', quantity: 0.5, avgBuyPrice: 30000.0, currentPrice: 64000.0 }
    ]
  });
});

// ✅ Add new holding to portfolio
router.post('/', (req, res) => {
  const { symbol, quantity, avgBuyPrice } = req.body;
  res.json({
    message: 'Holding added to portfolio',
    holding: { symbol, quantity, avgBuyPrice }
  });
});

module.exports = router;
