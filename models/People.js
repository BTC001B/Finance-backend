const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const People = sequelize.define('people', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expenses: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  userId: { // ✅ Added for user-specific filtering
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'people',
  timestamps: true
});

module.exports = People;
