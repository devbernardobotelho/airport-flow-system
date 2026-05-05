const express = require('express');
const router = express.Router();
const LandingService = require('../service/LandingService');
const SlotService = require('../service/SlotService');

// Solicita pouso
router.post('/', async (req, res) => {
    try {
        const result = await LandingService.requestLanding(req.body.flightId);
        res.status(201).json(result);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// Reserva um slot específico
router.post('/slots', async (req, res) => {
    try {
        const result = await SlotService.reserveSlot(req.body.slotId, req.body.flightId);
        res.status(201).json({ message: "Slot reservado", result });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;