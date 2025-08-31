const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const FinancialGoal = require('./FinancialGoal');

const GoalTransaction = sequelize.define('GoalTransaction', {
  goalId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  note: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'goal_transactions',
  timestamps: true
});

// Association
GoalTransaction.belongsTo(FinancialGoal, { foreignKey: 'goalId' });
FinancialGoal.hasMany(GoalTransaction, { foreignKey: 'goalId' });

module.exports = GoalTransaction;
