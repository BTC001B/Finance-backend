// controllers/reportController.js
const Order = require('../models/Order');
const TradeHistory = require('../models/TradeHistory');
const Holding = require('../models/Holding');

exports.pnlSummary = async (req, res) => {
  try {
    const userId = req.params.userId;
    // VERY simplistic P&L: value holdings at mock price
    const holdings = await Holding.findAll({ where: { UserId: userId }});
    const mockedPrices = {};
    const summary = holdings.map(h => {
      const mPrice = (Math.random()*1000 + 50).toFixed(2);
      mockedPrices[h.symbol] = mPrice;
      const currentValue = h.quantity * parseFloat(mPrice);
      const invested = h.quantity * h.avgBuyPrice;
      const pnl = currentValue - invested;
      return {
        symbol: h.symbol,
        quantity: h.quantity,
        avgBuyPrice: h.avgBuyPrice,
        marketPrice: parseFloat(mPrice),
        currentValue,
        invested,
        pnl
      };
    });

    const totalPnl = summary.reduce((s, i) => s + i.pnl, 0);
    res.json({ summary, totalPnl });
  } catch(err){ res.status(500).json({ error: err.message }); }
};
