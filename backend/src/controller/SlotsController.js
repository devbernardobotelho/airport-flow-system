const express = require('express');
const router = express.Router();
const SlotService = require('../service/SlotService');

router.get('/', async (req, res) => {
    try {
        const slots = await SlotService.getAll();
        res.status(200).json(slots);
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});

router.post('/', async (req, res) => {
    try {
        // Exemplo de payload: 
        // { "runwayId": "RW-01", "startTime": "2026-04-28T10:00:00Z", "endTime": "2026-04-28T11:00:00Z" }
        const slot = await SlotService.create(req.body);
        res.status(201).json(slot);
    } catch (err) { 
        res.status(400).json({ error: err.message }); 
    }
});

module.exports = router;