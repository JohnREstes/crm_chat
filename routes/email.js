// routes/email.js

const express = require('express');
const { SendEmailCommand } = require('@aws-sdk/client-ses');
const sesClient = require('../config/aws');
const Client = require('../models/Client');
const router = express.Router();

// Middleware to ensure user is authenticated
const { ensureAuthenticated } = require('../config/auth');
router.use(ensureAuthenticated);

router.get('/', async (req, res) => {
    try {
        const clients = await Client.find({ user: req.user._id }); // Fetch clients for the authenticated user
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
        const clients = await Client.find({ user: req.user._id }); // Fetch clients for the authenticated user
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
        res.redirect('/email/send?success=Emails sent successfully!');
    } catch (err) {
        console.error('Error sending email', err);
        res.redirect('/email/send?error=Failed to send email');
    }
});



module.exports = router;
