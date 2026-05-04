// src/service/AirlineService.js
const Airline = require('../models/AirlineModel');
const Flight = require('../models/FlightModel');

const AirlineService = {
    async create(data) {
        return await Airline.create(data);
    },

    async getAll() {
        return await Airline.findAll();
    },

    async delete(id) {
        // Regra de Negócio: Não pode excluir se tiver voos vinculados
        const flightCount = await Flight.count({ where: { airlineId: id } });
        
        if (flightCount > 0) {
            throw new Error("Não é possível excluir Airline com voos vinculados.");
        }
        
        return await Airline.destroy({ where: { id } });
    }
};

module.exports = AirlineService;