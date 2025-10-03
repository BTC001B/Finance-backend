const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Trip = sequelize.define('Trip', {
  place: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  userId: { // ✅ Added column for ownership
    type: DataTypes.INTEGER,
    allowNull: true, // temporary allowNull to avoid migration issues
    defaultValue: null
  }
}, {
  tableName: 'Trips',
  timestamps: true
});

module.exports = Trip;
