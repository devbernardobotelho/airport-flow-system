const Stand = require('../models/StandModel');
const RunwaySlot = require('../models/RunwaySlotModel');
const Airline = require('../models/AirlineModel');
const Flight = require('../models/FlightModel');
const { FlightStatus } = require('../models/enums/Enums');

const pad = (value) => String(value).padStart(2, '0');
const baseYear = new Date().getFullYear();
const buildDateString = (hour, minute) => {
    const date = new Date(baseYear, 0, 1, hour, minute, 0);
    return date.toISOString().slice(0, 19);
};

async function seedStands() {
    const standCount = await Stand.count();
    const slotCount = await RunwaySlot.count();
    const airlineCount = await Airline.count();
    const flightCount = await Flight.count();

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

    if (airlineCount === 0) {
        const latam = await Airline.create({ name: 'LATAM Airlines', code: 'TAM' });
        const azul = await Airline.create({ name: 'Azul Linhas Aéreas', code: 'AZU' });

        if (flightCount === 0) {
            await Flight.bulkCreate([
                { airlineId: latam.id, flightNumber: 'TAM101', status: FlightStatus.WAITING },
                { airlineId: latam.id, flightNumber: 'TAM102', status: FlightStatus.APPROACHING },
                { airlineId: azul.id, flightNumber: 'AZU201', status: FlightStatus.WAITING },
                { airlineId: azul.id, flightNumber: 'AZU202', status: FlightStatus.APPROACHING }
            ]);
        }
    } else if (flightCount === 0) {
        const airlines = await Airline.findAll({ limit: 2 });
        if (airlines.length > 0) {
            const creations = [];
            if (airlines[0]) creations.push({ airlineId: airlines[0].id, flightNumber: `${(airlines[0].code||'AAA').toUpperCase()}100`, status: FlightStatus.WAITING });
            if (airlines[1]) creations.push({ airlineId: airlines[1].id, flightNumber: `${(airlines[1].code||'BBB').toUpperCase()}200`, status: FlightStatus.WAITING });
            if (creations.length) await Flight.bulkCreate(creations);
        }
    }
}

module.exports = seedStands;