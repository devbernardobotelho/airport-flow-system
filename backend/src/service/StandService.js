const Stand = require('../models/StandModel');
const Flight = require('../models/FlightModel');
const sequelize = require('../config/database');

const StandService = {

    async findFreeStand() {
        return await Stand.findAll({
            where: {
                status: 'FREE'
            }
        });
    },

    async findFreeByType(type) {
        return await Stand.findOne({
            where: {
                type,
                status: 'FREE'
            }
        });
    },

    async reserve(standId, flightId) {
        const flight = await Flight.findByPk(flightId);
        const stand = await Stand.findByPk(standId);

        if (stand.status !== 'FREE') throw new Error("Stand ocupado.");
        if (!['APPROACHING', 'LANDED'].includes(flight.status)) throw new Error("Voo inválido para stand.");

        await sequelize.transaction(async (t) => {
            await stand.update({ status: 'OCCUPIED', flightId }, { transaction: t });
            await flight.update({ standId }, { transaction: t });
        });
    },

    async reallocate(oldStandId, newStandId, flightId) {
        // Regra: Só permitido se Stand atual ocupado e novo livre
        await sequelize.transaction(async (t) => {
            const oldStand = await Stand.findByPk(oldStandId, { transaction: t });
            const newStand = await Stand.findByPk(newStandId, { transaction: t });

            if (!oldStand || !newStand) throw new Error("Stand não encontrado.");
            if (newStand.status !== 'FREE') throw new Error("Novo stand não está livre.");

            await oldStand.update({ status: 'FREE', flightId: null }, { transaction: t });
            await newStand.update({ status: 'OCCUPIED', flightId }, { transaction: t });
            await Flight.update({ standId: newStandId }, { where: { id: flightId }, transaction: t });
        });
    }
};

module.exports = StandService;