// models/FundTransaction.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');


const FundTransaction = sequelize.define('FundTransaction', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  type: { type: DataTypes.ENUM('DEPOSIT','WITHDRAW'), allowNull: false },
  amount: { type: DataTypes.FLOAT, allowNull: false }
}, { timestamps: true });

module.exports = FundTransaction;
