const Transaction = require('../models/Transaction');
const Item = require('../models/Item');

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      include: Item
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
