const express = require('express');
const { SendEmailCommand } = require('@aws-sdk/client-ses');
const sesClient = require('../config/aws');
const Client = require('../models/Client');
const router = express.Router();

// Middleware to ensure user is authenticated
const { ensureAuthenticated } = require('../config/auth');
router.use(ensureAuthenticated);

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

    // Check if recipients are provided
    if (!recipients || recipients.length === 0) {
        return res.redirect('/email/send?error=Please select at least one recipient.');
    }

    const params = {
        Source: process.env.AWS_SES_SENDER, // Verified sender email
        Destination: {
            ToAddresses: recipients // Array of recipient emails
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
