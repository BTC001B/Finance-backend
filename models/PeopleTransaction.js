const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const People = require('./People');

const PeopleTransaction = sequelize.define('PeopleTransaction', {
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  purpose: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  }
});

// Associations
People.hasMany(PeopleTransaction, { foreignKey: 'peopleId' });
PeopleTransaction.belongsTo(People, { foreignKey: 'peopleId' });

module.exports = PeopleTransaction;
