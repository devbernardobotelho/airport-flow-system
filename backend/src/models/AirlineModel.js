const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Airline = sequelize.define('Airline', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  code: { type: DataTypes.STRING, allowNull: false, unique: true } // Ex: TAM, GOL, AZU
});

module.exports = Airline;