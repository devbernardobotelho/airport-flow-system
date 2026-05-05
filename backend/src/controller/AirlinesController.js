const express = require('express');
const router = express.Router();
const AirlineService = require('../service/AirlineService');

router.get('/', async (req, res) => {
    try {
        const airline = await AirlineService.getAll();
        res.status(200).json(airline);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
    try {
        const airline = await AirlineService.create(req.body);
        res.status(201).json(airline);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
    try {
        await AirlineService.delete(req.params.id);
        res.status(204).send();
    } catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;