const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Flight = require('./FlightModel');

const RunwaySlot = sequelize.define('RunwaySlot', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    flightId: {
        type: DataTypes.UUID,
        allowNull: true
    },
    runwayId: { type: DataTypes.STRING, allowNull: false },
    startTime: { type: DataTypes.DATE, allowNull: false },
    endTime: { type: DataTypes.DATE, allowNull: false }
});


module.exports = RunwaySlot;