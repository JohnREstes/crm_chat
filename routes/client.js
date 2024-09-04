// routes/client.js

import express from 'express';
import Client from '../models/Client.js';
import { ensureAuthenticated } from '../config/auth.js';

const router = express.Router();
const BASE_PATH = process.env.BASE_PATH || '';
const masterUserId = process.env.MONGO_MASTER;

router.use(ensureAuthenticated);

// Add a new client
router.post('/add', async (req, res) => {
    const { name, email, phone, notes, address, creditCardNumber, creditCardExpiry, creditCardCVV } = req.body;
    const encryptedCreditCardNumber = Client.encryptCreditCardNumber(creditCardNumber);
    const newClient = new Client({ 
        name, 
        email, 
        phone, 
        notes, 
        address, 
        creditCardNumber: encryptedCreditCardNumber, 
        creditCardExpiry, 
        creditCardCVV, 
        user: req.user._id 
    });
    await newClient.save();
    res.redirect(`${BASE_PATH}/clients`);
});

// Edit an existing client
router.post('/edit/:id', async (req, res) => {
    console.log('Request Body:', req.body);
    try {
        const { name, email, phone, notes, address, creditCardNumber, creditCardExpiry, creditCardCVV } = req.body;
        const client = await Client.findById(req.params.id);

        if (!client || !req.user) {
            return res.status(404).send('Client not found');
        }

        // Encrypt the credit card number before updating
        const encryptedCreditCardNumber = Client.encryptCreditCardNumber(creditCardNumber);

        // Prepare the updated client data
        const updateData = { 
            name, 
            email, 
            phone, 
            notes, 
            address, 
            creditCardNumber: encryptedCreditCardNumber, 
            creditCardExpiry, 
            creditCardCVV, 
            user: req.user._id 
        };

        console.log('Update Data:', updateData);

        // Update the client in the database
        await Client.findByIdAndUpdate(req.params.id, updateData);
        res.redirect(`${BASE_PATH}/clients`);
    } catch (error) {
        console.error('Error updating client:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Delete a client
router.post('/delete/:id', async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);

        if (client && req.user) {
            if (req.user._id.toString() === masterUserId || client.user.toString() === req.user._id.toString()) {
                await Client.findByIdAndDelete(req.params.id);
                res.redirect(`${BASE_PATH}/clients`);
            } else {
                res.status(403).send('Forbidden');
            }
        } else {
            res.status(404).send('Client not found');
        }
    } catch (error) {
        console.error('Error deleting client:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Get all clients for the authenticated user
router.get('/', async (req, res) => {
    try {
        const clients = await Client.find({ user: req.user._id })
            .sort({ name: 1 }); // Sort by name in ascending order (alphabetical)

        clients.forEach(client => {
            client.creditCardNumber = client.decryptCreditCardNumber();
        });

        res.render('clients', { clients });
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).send('Internal Server Error');
    }
});

export default router;
