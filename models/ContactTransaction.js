const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Contact = require('./Contact');
const User = require("./User")

const ContactTransaction = sequelize.define('ContactTransaction', {
  contactId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }, 
  type: {
    type: DataTypes.ENUM('pay', 'get'),
    allowNull: false
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  note: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'contact_transactions',
  timestamps: true
});

// Association
ContactTransaction.belongsTo(Contact, { foreignKey: 'contactId' });
Contact.hasMany(ContactTransaction, { foreignKey: 'contactId' });



module.exports = ContactTransaction;
