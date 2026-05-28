const Flight = require('../models/FlightModel');
const Airline = require('../models/AirlineModel');
const RunwaySlot = require('../models/RunwaySlotModel');
const Stand = require('../models/StandModel');
const sequelize = require('../config/database');
const { FlightStatus } = require('../models/enums/Enums.js');

function generateFlightNumber(code) {
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${code}${random}`;
};


const FlightService = {

    async fetchAllFlights() {
        return await Flight.findAll({
            include: [
                {
                    model: Airline,
                    as: "Airline",
                    attributes: ['id', 'name']
                },
                {
                    model: RunwaySlot,
                    as: "runwaySlot",
                    required: false
                },
                {
                    model: Stand,
                    as: "stand",
                    required: false
                }
            ]
        });
    },

    async scheduleNewFlight(data) {
        const airline = await Airline.findByPk(data.airlineId);

        if (!airline) throw new Error("Airline inválida.");

        const flightNumber = generateFlightNumber(airline.code);

        return await Flight.create({
            airlineId: data.airlineId,
            priority: data.priority,
            status: FlightStatus.WAITING,
            flightNumber
        });
    },

    async updateFlightStatus(id, newStatus) {

        const flight = await Flight.findByPk(id);
        if (!flight) throw new Error("Voo não encontrado.");

        const flow = {
            [FlightStatus.WAITING]: FlightStatus.APPROACHING,
            [FlightStatus.APPROACHING]: FlightStatus.LANDED
        };

        if (flight.status !== newStatus && flow[flight.status] !== newStatus) {
            throw new Error(`Fluxo inválido: ${flight.status} não pode ir para ${newStatus}.`);
        }
        const slot = await RunwaySlot.findOne({
            where: { flightId: flight.id }
        });

        const stand = await Stand.findOne({
            where: { flightId: flight.id }
        });

        if (newStatus === FlightStatus.APPROACHING && !slot) {
            throw new Error("Voo precisa de slot reservado para aproximar.");
        }

        if (newStatus === FlightStatus.LANDED && !stand) {
            throw new Error("Voo precisa de stand reservado para pousar.");
        }

        await sequelize.transaction(async (t) => {
            if (newStatus === FlightStatus.LANDED) {
                if (slot) {
                    await slot.update({ flightId: null }, { transaction: t });
                }

                if (stand) {
                    await stand.update({ status: 'FREE', flightId: null }, { transaction: t });
                }
            }

            flight.status = newStatus;
            await flight.save({ transaction: t });
        });

        return flight;
    },
};

module.exports = FlightService;