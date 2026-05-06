const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { Priority, FlightStatus } = require('./enums/Enums.js');

const Airline = require('./AirlineModel');
const Stand = require('./StandModel');
const RunwaySlot = require('./RunwaySlotModel');

const Flight = sequelize.define('Flight', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    airlineId: {
        type: DataTypes.UUID,
        allowNull: false
    },

    flightNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    priority: {
        type: DataTypes.ENUM(Object.values(Priority)),
        defaultValue: Priority.NORMAL
    },

    status: {
        type: DataTypes.ENUM(Object.values(FlightStatus)),
        defaultValue: FlightStatus.WAITING
    }
});

Flight.belongsTo(Airline, { foreignKey: 'airlineId', as: 'Airline' });

Flight.hasOne(RunwaySlot, {
    foreignKey: 'flightId',
    as: 'runwaySlot'
});

Flight.hasOne(Stand, {
    foreignKey: 'flightId',
    as: 'stand'
});

module.exports = Flight;