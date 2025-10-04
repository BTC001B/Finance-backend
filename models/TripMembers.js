// models/TripMember.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');


const TripMember = sequelize.define('TripMember', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  tripId: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: true },    
  contactId: { type: DataTypes.INTEGER, allowNull: true }  
}, {
  tableName: 'TripMembers',
  timestamps: true
});



module.exports = TripMember;
