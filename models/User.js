// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  kycStatus: { type: DataTypes.ENUM('pending','verified','rejected'), defaultValue: 'pending' }
}, { timestamps: true });

// helper
User.prototype.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

module.exports = User;
