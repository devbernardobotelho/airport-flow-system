const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RunwaySlot = sequelize.define('RunwaySlot', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    runwayId: { type: DataTypes.STRING, allowNull: false },
    startTime: { type: DataTypes.DATE, allowNull: false },
    endTime: { type: DataTypes.DATE, allowNull: false }
});

RunwaySlot.afterUpdate(async (slot, options) => {
    if (slot.flightId === null) {
        // Se o slot foi liberado (flightId virou null), limpa o voo
        await Flight.update({ slotId: null }, { 
            where: { slotId: slot.id }, 
            transaction: options.transaction 
        });
    }
});

module.exports = RunwaySlot;