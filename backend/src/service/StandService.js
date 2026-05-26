const Stand = require('../models/StandModel');
const Flight = require('../models/FlightModel');
const sequelize = require('../config/database');

const StandService = {

    async findFreeStand(type) {
        return await Stand.findOne({
            where: {
                type,
                status: 'FREE'
            }
        });
    },

    async findAllStands() {
        return await Stand.findAll();
    },

    async reserve(standId, flightId) {
        const flight = await Flight.findByPk(flightId);

        if (!flight) throw new Error("Flight não encontrado");

        if (!['APPROACHING', 'LANDED'].includes(flight.status)) {
            throw new Error("Voo inválido para reservar stand.");
        }

        const existingStand = await Stand.findOne({
            where: { flightId }
        });

        if (existingStand) {
            throw new Error("Voo já possui um stand.");
        }

        const stand = await Stand.findByPk(standId);

        if (!stand) throw new Error("Stand não encontrado");
        if (stand.status !== 'FREE') throw new Error("Stand não está livre.");

        await sequelize.transaction(async (t) => {
            await stand.update(
                { status: 'OCCUPIED', flightId },
                { transaction: t }
            );
        });

        return stand;
    },

    async reallocate(oldStandId, newStandId, flightId) {
        await sequelize.transaction(async (t) => {

            const oldStand = await Stand.findByPk(oldStandId, { transaction: t });
            const newStand = await Stand.findByPk(newStandId, { transaction: t });

            if (!oldStand || !newStand) {
                throw new Error("Stand não encontrado.");
            }

            if (oldStand.flightId !== flightId) {
                throw new Error("Stand atual não pertence ao voo.");
            }

            if (newStand.status !== 'FREE') {
                throw new Error("Novo stand não está livre.");
            }

            // libera antigo
            await oldStand.update(
                { status: 'FREE', flightId: null },
                { transaction: t }
            );

            // ocupa novo
            await newStand.update(
                { status: 'OCCUPIED', flightId },
                { transaction: t }
            );
        });
    }
};

module.exports = StandService;