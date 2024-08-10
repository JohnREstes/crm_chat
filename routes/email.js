// routes/email.js
const express = require('express');
const { SendEmailCommand } = require('@aws-sdk/client-ses');
const sesClient = require('../config/aws');
const Client = require('../models/Client');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const clients = await Client.find(); // Fetch all clients from the database
        res.render('send-email', { clients });
    } catch (err) {
        console.error('Error fetching clients', err);
        res.status(500).send('Failed to load email page');
    }
});

router.post('/send', async (req, res) => {
    const { subject, message, recipients } = req.body;

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
        res.send('Email sent successfully');
    } catch (err) {
        console.error('Error sending email', err);
        res.status(500).send('Failed to send email');
    }
});

module.exports = router;
