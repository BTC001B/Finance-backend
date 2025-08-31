// models/TradeHistory.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');


const TradeHistory = sequelize.define('TradeHistory', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  executionPrice: { type: DataTypes.FLOAT, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false }
}, { timestamps: true });

module.exports = TradeHistory;
