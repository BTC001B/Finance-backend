const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Item = require('./Item');

const Transaction = sequelize.define('Transaction', {
  type: {
    type: DataTypes.STRING,
    allowNull: false, // ensures type is always provided ('stock-in' or 'stock-out')
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false, // ensures quantity is mandatory
  },
  user: {
    type: DataTypes.STRING, 
    allowNull: true, // ensures user info is recorded
  },
  note: {
    type: DataTypes.STRING,
    allowNull: true, // optional notes
  },
}, {
  tableName: 'transactions',
  timestamps: true, // adds createdAt and updatedAt fields
});

// Associations
Transaction.belongsTo(Item, { foreignKey: 'itemId' });
Item.hasMany(Transaction, { foreignKey: 'itemId' });

module.exports = Transaction;
