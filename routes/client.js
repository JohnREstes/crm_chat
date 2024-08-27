//routes/client.js
import express from 'express';
import Client from '../models/Client.js';
import { ensureAuthenticated } from '../config/auth.js';

const router = express.Router();

// Define the master user ID (replace this with the actual master user ID)
const masterUserId = process.env.MONGO_MASTER; // Replace with your master user ID

// Middleware to ensure user is authenticated
router.use(ensureAuthenticated);

// Add a new client
router.post('/add', async (req, res) => {
    const { name, email, phone, notes, address, creditCardNumber, creditCardExpiry, creditCardCVV } = req.body; // Include address
    console.log('Received data for new client:', { name, email, phone, notes, address, creditCardExpiry, creditCardCVV }); // Log non-sensitive data
    const newClient = new Client({ name, email, phone, notes, address, creditCardNumber, creditCardExpiry, creditCardCVV, user: req.user._id }); // Include address
    await newClient.save();
    res.redirect('/clients');
});

// Edit an existing client
router.post('/edit/:id', async (req, res) => {
    const { name, email, phone, notes, address, creditCardNumber, creditCardExpiry, creditCardCVV } = req.body; // Include address
    const client = await Client.findById(req.params.id);
    
    // Ensure `client` is found and user is authenticated
    if (client && req.user) {
        // Check if the user is the master user or the owner of the record
        if (req.user._id.toString() === masterUserId || client.user.toString() === req.user._id.toString()) {
            const updateData = { name, email, phone, notes, address, creditCardExpiry, creditCardCVV }; // Only update non-sensitive data
            
            if (creditCardNumber) {
                updateData.creditCardNumber = creditCardNumber;
            }
            
            await Client.findByIdAndUpdate(req.params.id, updateData); // Include address
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

export default router;

