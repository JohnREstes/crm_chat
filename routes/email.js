// routes/email.js
// routes/email.js

import express from 'express';
import { SendEmailCommand } from '@aws-sdk/client-ses';
import sesClient from '../config/aws.js';
import Client from '../models/Client.js';
import { ensureAuthenticated } from '../config/auth.js';

const router = express.Router();
const BASE_PATH = process.env.BASE_PATH || ''; // Use the BASE_PATH environment variable

// Middleware to ensure user is authenticated
router.use(ensureAuthenticated);

// Route to view the email page
router.get('/', async (req, res) => {
    try {
        // Fetch clients for the authenticated user and sort them alphabetically by name
        const clients = await Client.find({ user: req.user._id }).sort({ name: 1 });
        res.render('send-email', { 
            clients, 
            success: req.query.success, 
            error: req.query.error 
        });
    } catch (err) {
        console.error('Error fetching clients', err);
        res.status(500).send('Failed to load email page');
    }
});

// Show form for sending bulk email
router.get('/send', async (req, res) => {
    try {
        // Fetch clients for the authenticated user and sort them alphabetically by name
        const clients = await Client.find({ user: req.user._id }).sort({ name: 1 });
        res.render('send-email', { 
            clients, 
            success: req.query.success, 
            error: req.query.error 
        });
    } catch (err) {
        console.error('Error fetching clients', err);
        res.status(500).send('Failed to load email page');
    }
});

// Handle bulk email sending
router.post('/send', async (req, res) => {
    const { subject, message, recipients } = req.body;

    // Convert recipients to an array if it's not already one
    let recipientList = Array.isArray(recipients) ? recipients : [recipients];

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmails = recipientList.filter(email => emailRegex.test(email));

    // If no valid emails are found
    if (validEmails.length === 0) {
        return res.redirect('/email/send?error=No valid email addresses provided.');
    }

    // Log valid emails to be sent
    console.log("Sending email to:", validEmails);

    const params = {
        Source: process.env.AWS_SES_SENDER, // Verified sender email
        Destination: {
            ToAddresses: validEmails // Now always an array
        },
        Message: {
            Subject: { Data: subject },
            Body: {
                Text: { Data: message }
            }
        }
    };

    try {
        const command = new SendEmailCommand(params);
        await sesClient.send(command);
        res.redirect(`${BASE_PATH}/email/send?success=Emails sent successfully!`);
    } catch (err) {
        console.error('Error sending email', err);
        res.redirect(`${BASE_PATH}/email/send?error=Failed to send email`);
    }
});

export default router;
