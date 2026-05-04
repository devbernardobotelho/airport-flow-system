const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { StandStatus, StandType } = require('../config/enums');

const Stand = sequelize.define('Stand', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    type: { type: DataTypes.ENUM(Object.values(StandType)), allowNull: false },
    status: { type: DataTypes.ENUM(Object.values(StandStatus)), defaultValue: StandStatus.FREE }
});

module.exports = Stand;
