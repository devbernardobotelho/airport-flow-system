const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Airport = sequelize.define('Airport', {
  code: { type: DataTypes.STRING, primaryKey: true }, // Ex: GRU, GIG
  name: { type: DataTypes.STRING, allowNull: false },
  city: { type: DataTypes.STRING }
});

module.exports = Airport;