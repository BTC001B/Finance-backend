// controllers/accountController.js
const Account = require('../models/Account');
const User = require('../models/User');
const FundTransaction = require('../models/FundTransaction');

exports.getBalance = async (req, res) => {
  try {
    const account = await Account.findOne({ where: { userId: req.params.userId }});
    if(!account) return res.status(404).json({ error: 'account not found' });
    res.json({ balance: account.balance, marginAvailable: account.marginAvailable });
  } catch(err) { res.status(500).json({ error: err.message }); }
};

exports.createAccount = async (req, res) => {
  try {
    const { userId, balance } = req.body;
    if(!userId) return res.status(400).json({ error: 'userId required' });
    const user = await User.findByPk(userId);
    if(!user) return res.status(404).json({ error: 'user not found' });
    const account = await Account.create({ userId: userId, balance: balance ?? 0 });
    res.status(201).json({ account });
  } catch(err) { res.status(500).json({ error: err.message }); }
};

exports.deposit = async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount } = req.body;
    if(!amount || amount <= 0) return res.status(400).json({ error: 'invalid amount' });
    const account = await Account.findOne({ where: { userId: userId }});
    if(!account) return res.status(404).json({ error: 'account not found' });

    account.balance += parseFloat(amount);
    await account.save();

    await FundTransaction.create({ userId: userId, type: 'DEPOSIT', amount });

    res.json({ message: 'deposit successful', newBalance: account.balance });
  } catch(err) { res.status(500).json({ error: err.message }); }
};

exports.withdraw = async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount } = req.body;
    if(!amount || amount <= 0) return res.status(400).json({ error: 'invalid amount' });
    const account = await Account.findOne({ where: { userId: userId }});
    if(!account) return res.status(404).json({ error: 'account not found' });

    if(account.balance < amount) return res.status(400).json({ error: 'insufficient funds' });

    account.balance -= parseFloat(amount);
    await account.save();

    await FundTransaction.create({ UserId: userId, type: 'WITHDRAW', amount });

    res.json({ message: 'withdraw successful', newBalance: account.balance });
  } catch(err) { res.status(500).json({ error: err.message }); }
};
