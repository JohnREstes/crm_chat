const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    notes: { type: String },
    address: { type: String } // Add your new field here
});

module.exports = mongoose.model('Client', clientSchema);
