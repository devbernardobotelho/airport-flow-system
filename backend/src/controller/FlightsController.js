const express = require('express');
const router = express.Router();
const FlightService = require('../service/FlightService');

router.get('/', async (req, res) => {
    try {
        const flights = await FlightService.fetchAllFlights();
        res.status(200).json(flights);
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});
router.post('/', async (req, res) => {
    try {
        const flight = await FlightService.scheduleNewFlight(req.body);
        res.status(201).json(flight);
    } catch (err) { 
        res.status(400).json({ error: err.message }); 
    }
});

router.patch('/:id/status', async (req, res) => {
    try {
        const updated = await FlightService.updateFlightStatus(req.params.id, req.body.status);
        res.status(200).json({ message: "Status atualizado", flight: updated });
    } catch (err) { 
        res.status(400).json({ error: err.message }); 
    }
});

module.exports = router;