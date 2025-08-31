const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Contact = sequelize.define('contact', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  userId: { // ✅ Link each contact to a specific user
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'contacts',
  timestamps: true
});

module.exports = Contact;
