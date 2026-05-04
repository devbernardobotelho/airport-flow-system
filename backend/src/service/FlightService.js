const Flight = require('../models/FlightModel');
const Airline = require('../models/AirlineModel');
const { FlightStatus } = require('../config/enums');

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

        if (newStatus === FlightStatus.APPROACHING && !flight.slotId) 
            throw new Error("Voo precisa de slot reservado para aproximar.");
        
        if (newStatus === FlightStatus.LANDED && !flight.standId) 
            throw new Error("Voo precisa de stand reservado para pousar.");

        flight.status = newStatus;
        return await flight.save();
    }
};

module.exports = FlightService;