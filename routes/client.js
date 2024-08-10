const express = require('express');
const Client = require('../models/Client');
const router = express.Router();

// Add a new client
router.post('/add', async (req, res) => {
    const { name, email, phone, notes, address } = req.body; // Include new field
    const newClient = new Client({ name, email, phone, notes, address });
    await newClient.save();
    res.redirect('/clients');
});

// Edit an existing client
router.post('/edit/:id', async (req, res) => {
    const { name, email, phone, notes, address } = req.body; // Include new field
    await Client.findByIdAndUpdate(req.params.id, { name, email, phone, notes, address });
    res.redirect('/clients');
});

// View all clients
router.get('/', async (req, res) => {
    const clients = await Client.find();
    res.render('clients', { clients });
});

module.exports = router;
