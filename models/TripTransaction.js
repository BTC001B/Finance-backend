const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Trip = require('./Trip');

const TripTransaction = sequelize.define('TripTransaction', {
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  purpose: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
});

Trip.hasMany(TripTransaction, { foreignKey: 'tripId' });
TripTransaction.belongsTo(Trip, { foreignKey: 'tripId' });

module.exports = TripTransaction;
