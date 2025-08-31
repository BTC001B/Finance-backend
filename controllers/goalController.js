const FinancialGoal = require('../models/FinancialGoal');
const GoalTransaction = require('../models/GoalTransaction');

// 1️⃣ Create Goal
exports.createGoal = async (req, res) => {
  try {
    const { title, targetAmount, currentAmount, dueDate, note, userId } = req.body; // ✅ userId
    const goal = await FinancialGoal.create({ title, targetAmount, currentAmount, dueDate, note, userId });
    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2️⃣ Put Amount to Goal
exports.addAmount = async (req, res) => {
  try {
    const goal = await FinancialGoal.findByPk(req.body.goalId);
    if (!goal) return res.status(404).json({ message: 'Goal not found' });

    goal.currentAmount += req.body.amount;
    await goal.save();

    const txn = await GoalTransaction.create({
      goalId: goal.id,
      amount: req.body.amount,
      date: req.body.date,
      note: req.body.note
    });

    res.json({ message: 'Amount added to goal', goal, txn });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3️⃣ Get Goal History
exports.getGoalHistory = async (req, res) => {
  try {
    const history = await GoalTransaction.findAll({
      where: { goalId: req.params.goalId }
    });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4️⃣ Get All Goals by UserId ✅
exports.getGoalsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const goals = await FinancialGoal.findAll({
      where: { userId },
      include: [GoalTransaction]
    });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
