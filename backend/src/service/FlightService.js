const Flight = require('../models/FlightModel');
const Airline = require('../models/AirlineModel');
const RunwaySlot = require('../models/RunwaySlotModel');
const Stand = require('../models/StandModel');
const { FlightStatus } = require('../models/enums/Enums.js');

const FlightService = {

    async fetchAllFlights() {
        return await Flight.findAll();
    },

    async scheduleNewFlight(data) {
        const airline = await Airline.findByPk(data.airlineId);

        if (!airline) throw new Error("Airline inválida ou não encontrada.");
        if (data.status === 'LANDED') throw new Error("Voo não pode ser criado como LANDED.");

        return await Flight.create({ ...data, status: FlightStatus.WAITING });
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

        flight.status = newStatus;
        return await flight.save();
    }
};

module.exports = FlightService;