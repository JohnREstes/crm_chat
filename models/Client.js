// models/Client.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    notes: { type: String },
    address: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true } // Associate with User model
});

module.exports = mongoose.model('Client', clientSchema);
