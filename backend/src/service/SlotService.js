const RunwaySlot = require('../models/RunwaySlotModel');
const Flight = require('../models/FlightModel');

const SlotService = {
    async getAll() {
        return await RunwaySlot.findAll();
    },

    async findAvailableSlot() {
        return await RunwaySlot.findAll({ where: { flightId: null } });
    },

    async create(data) {
        return await RunwaySlot.create(data);
    },

    async reserveSlot(slotId, flightId) {
        const slot = await RunwaySlot.findByPk(slotId);
        if (!slot) throw new Error("Slot não encontrado.");
        if (slot.flightId) throw new Error("Slot já reservado.");

        await slot.update({ flightId });
        await Flight.update({ slotId: slot.id }, { where: { id: flightId } });
        
        return slot;
    }
};

module.exports = SlotService;