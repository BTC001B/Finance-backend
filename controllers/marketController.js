// controllers/marketController.js
// This is a placeholder. Replace with real data provider integration.
exports.getMarketData = async (req, res) => {
  try {
    const symbol = req.params.symbol;
    // Mock data
    const mock = {
      symbol,
      lastPrice: (Math.random()*1000).toFixed(2),
      dayHigh: (Math.random()*1000 + 1000).toFixed(2),
      dayLow: (Math.random()*100).toFixed(2),
      volume: Math.floor(Math.random()*100000)
    };
    res.json(mock);
  } catch(err){ res.status(500).json({ error: err.message }); }
};

exports.getTop = async (req, res) => {
  res.json({ topGainers: [], topLosers: [] }); // stub
};
