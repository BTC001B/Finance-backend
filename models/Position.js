// models/Position.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');


const Position = sequelize.define('Position', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  symbol: { type: DataTypes.STRING, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  entryPrice: { type: DataTypes.FLOAT, allowNull: false },
  side: { type: DataTypes.ENUM('LONG','SHORT'), allowNull: false }
}, { timestamps: true });

module.exports = Position;
