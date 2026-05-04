const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { Priority, FlightStatus } = require('../config/enums');

const Flight = sequelize.define('Flight', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    priority: { type: DataTypes.ENUM(Object.values(Priority)), defaultValue: Priority.NORMAL },
    status: { type: DataTypes.ENUM(Object.values(FlightStatus)), defaultValue: FlightStatus.WAITING },
});

Flight.hasOne(require('./StandModel'), { foreignKey: 'flightId' });
Flight.hasOne(require('./RunwaySlotModel'), { foreignKey: 'flightId' });

module.exports = Flight;

