// models/Order.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');


const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  symbol: { type: DataTypes.STRING, allowNull: false },
  side: { type: DataTypes.ENUM('BUY','SELL'), allowNull: false },
  orderType: { type: DataTypes.ENUM('MARKET','LIMIT','STOPLOSS'), allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: true }, // price for LIMIT
  status: { type: DataTypes.ENUM('OPEN','EXECUTED','CANCELLED'), defaultValue: 'OPEN' },
  executedAt: { type: DataTypes.DATE, allowNull: true }
}, { timestamps: true });

module.exports = Order;
