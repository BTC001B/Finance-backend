// controllers/portfolioController.js
const Holding = require('../models/Holding');
const Position = require('../models/Position');

exports.getHoldings = async (req, res) => {
  try {
    const holdings = await Holding.findAll({ where: { UserId: req.params.userId }});
    res.json(holdings);
  } catch(err){ res.status(500).json({ error: err.message }); }
};

exports.getPositions = async (req, res) => {
  try {
    const positions = await Position.findAll({ where: { UserId: req.params.userId }});
    res.json(positions);
  } catch(err){ res.status(500).json({ error: err.message }); }
};
