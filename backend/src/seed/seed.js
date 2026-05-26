const Stand = require('../models/StandModel');
const RunwaySlot = require('../models/RunwaySlotModel');

const pad = (value) => String(value).padStart(2, '0');
const baseYear = new Date().getFullYear();
const buildDateString = (hour, minute) => {
    const date = new Date(baseYear, 0, 1, hour, minute, 0);
    return date.toISOString().slice(0, 19);
};

async function seedStands() {
    const standCount = await Stand.count();
    const slotCount = await RunwaySlot.count();

    if (standCount === 0) {
        await Stand.bulkCreate([
            { type: "GATE", status: "FREE" },
            { type: "GATE", status: "FREE" },
            { type: "REMOTE", status: "FREE" },
            { type: "REMOTE", status: "FREE" }
        ]);
    }

    if (slotCount === 0) {
        const runways = ["RW09", "RW27"];
        const slots = [];

        for (const runwayId of runways) {
            for (let hour = 0; hour < 24; hour += 1) {
                for (let minute = 0; minute < 60; minute += 15) {
                    const nextMinute = minute + 15;
                    const nextHour = nextMinute === 60 ? hour + 1 : hour;
                    const endMinute = nextMinute === 60 ? 0 : nextMinute;
                    const startTime = buildDateString(hour, minute);
                    const endTime = buildDateString(nextHour, endMinute);

                    slots.push({
                        runwayId,
                        startTime,
                        endTime,
                        flightId: null
                    });
                }
            }
        }

        await RunwaySlot.bulkCreate(slots);
    }
}

module.exports = seedStands;