const express = require('express');
const Client = require('../models/Client');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth'); // Adjust path if needed

// Define the master user ID (replace this with the actual master user ID)
const masterUserId = process.env.MONGO_MASTER; // Replace with your master user ID

// Middleware to ensure user is authenticated
router.use(ensureAuthenticated);

// Add a new client
router.post('/add', async (req, res) => {
    const { name, email, phone, notes, address } = req.body; // Include address
    console.log('Received data for new client:', { name, email, phone, notes, address }); // Log data
    const newClient = new Client({ name, email, phone, notes, address, user: req.user._id }); // Include address
    await newClient.save();
    res.redirect('/clients');
});

// Edit an existing client
router.post('/edit/:id', async (req, res) => {
    const { name, email, phone, notes, address } = req.body; // Include address
    const client = await Client.findById(req.params.id);
    
    // Ensure `client` is found and user is authenticated
    if (client && req.user) {
        // Check if the user is the master user or the owner of the record
        if (req.user._id.toString() === masterUserId || client.user.toString() === req.user._id.toString()) {
            await Client.findByIdAndUpdate(req.params.id, { name, email, phone, notes, address }); // Include address
            res.redirect('/clients');
        } else {
            res.status(403).send('Forbidden');
        }
    } else {
        res.status(404).send('Client not found');
    }
});

// View all clients
router.get('/', async (req, res) => {
    const clients = await Client.find({ user: req.user._id });
    res.render('clients', { clients });
});

module.exports = router;
