const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Item = sequelize.define('Item', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
    userId: { // ✅ Add this column
    type: DataTypes.INTEGER,
    allowNull: false
  },
  sku: {
    type: DataTypes.STRING,
    unique: true,
  },
  category: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true, // optional field for item details
    comment: 'Optional field to store item details',
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  unitCost: {
    type: DataTypes.FLOAT,
  },
  reorderLevel: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'Items',
  timestamps: true,
});

module.exports = Item;
