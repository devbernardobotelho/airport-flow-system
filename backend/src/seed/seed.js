const Stand = require('../models/StandModel');

async function seedStands() {
    const count = await Stand.count();

    if (count > 0) return;

    await Stand.bulkCreate([
        { type: "GATE", status: "FREE" },
        { type: "GATE", status: "FREE" },
        { type: "REMOTE", status: "FREE" },
        { type: "REMOTE", status: "FREE" }
    ]);
}

module.exports = seedStands;