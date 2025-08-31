const express = require('express');
const router = express.Router();

// ✅ Get all orders
router.get('/', (req, res) => {
  res.json({
    message: 'Orders fetched successfully',
    orders: [
      { id: 1, symbol: 'AAPL', type: 'BUY', quantity: 10, price: 150, status: 'FILLED' },
      { id: 2, symbol: 'TSLA', type: 'SELL', quantity: 5, price: 780, status: 'PENDING' }
    ]
  });
});

// ✅ Place a new order
router.post('/', (req, res) => {
  const { symbol, type, quantity, price } = req.body;
  res.json({
    message: 'Order placed successfully',
    order: { symbol, type, quantity, price, status: 'PENDING' }
  });
});

// ✅ Cancel an order
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `Order ${id} cancelled successfully` });
});

module.exports = router;
