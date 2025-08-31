// models/Account.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');


const Account = sequelize.define('Account', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  balance: { type: DataTypes.FLOAT, defaultValue: 0 },
  marginAvailable: { type: DataTypes.FLOAT, defaultValue: 0 }
}, { tableName:'Account',timestamps: true });

module.exports = Account;
