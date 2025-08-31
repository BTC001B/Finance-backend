const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const FinancialGoal = sequelize.define('FinancialGoal', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  targetAmount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  currentAmount: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  dueDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  note: {
    type: DataTypes.STRING,
    allowNull: true
  },
  userId: { // ✅ Added for user-specific filtering
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'financial_goals',
  timestamps: true
});

module.exports = FinancialGoal;
