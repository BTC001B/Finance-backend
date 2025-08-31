// controllers/watchlistController.js
const Watchlist = require('../models/Watchlist');

exports.add = async (req, res) => {
  try {
    const { userId } = req.params;
    const { symbol, exchange } = req.body;
    if(!symbol) return res.status(400).json({ error: 'symbol required' });
    const item = await Watchlist.create({ UserId: userId, symbol, exchange: exchange || 'NSE' });
    res.status(201).json(item);
  } catch(err){ res.status(500).json({ error: err.message }); }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Watchlist.findByPk(id);
    if(!item) return res.status(404).json({ error: 'not found' });
    await item.destroy();
    res.json({ message: 'removed' });
  } catch(err){ res.status(500).json({ error: err.message }); }
};

exports.list = async (req, res) => {
  try {
    const { userId } = req.params;
    const items = await Watchlist.findAll({ where: { UserId: userId }});
    res.json(items);
  } catch(err){ res.status(500).json({ error: err.message }); }
};
