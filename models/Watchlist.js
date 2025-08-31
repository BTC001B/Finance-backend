// models/Watchlist.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');


const Watchlist = sequelize.define('Watchlist', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  symbol: { type: DataTypes.STRING, allowNull: false },
  exchange: { type: DataTypes.STRING, allowNull: false, defaultValue: 'NSE' }
}, { timestamps: true });

module.exports = Watchlist;
