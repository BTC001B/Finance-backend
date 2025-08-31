// models/Holding.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');


const Holding = sequelize.define('Holding', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  symbol: { type: DataTypes.STRING, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  avgBuyPrice: { type: DataTypes.FLOAT, allowNull: false }
}, { timestamps: true });

module.exports = Holding;
