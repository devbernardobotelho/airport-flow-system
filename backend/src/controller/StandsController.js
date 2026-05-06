const express = require('express');
const router = express.Router();
const StandService = require('../service/StandService');

router.get('/', async (req, res) => {
    try {
        const stands = await StandService.findAllStands();
        res.status(200).json(stands);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/reserve', async (req, res) => {
    try {
        const { type, flightId } = req.body;

        const stand = await StandService.findFreeStand(type);

        if (!stand) {
            return res.status(404).json({ error: "Nenhum stand livre desse tipo" });
        }

        const updated = await StandService.reserve(stand.id, flightId);

        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// POST /stands/:id/reallocate - Realoca um voo
router.post('/:id/reallocate', async (req, res) => {
    try {
        await StandService.reallocate(req.params.id, req.body.newStandId, req.body.flightId);
        res.status(201).json({ message: "Stand realocado" });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;