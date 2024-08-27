// models/Client.js
import mongoose from 'mongoose';
import crypto from 'crypto';

const { Schema } = mongoose;

// Encryption function
const encrypt = (text) => {
    const algorithm = 'aes-256-cbc';
    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex'); // Ensure key is in correct format
    const iv = crypto.randomBytes(16); // Initialization vector

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Combine iv and encrypted text for storage
    return iv.toString('hex') + ':' + encrypted;
};

// Decryption function
const decrypt = (text) => {
    if (!text) return ''; // Return empty string if text is not provided

    const algorithm = 'aes-256-cbc';
    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
    const textParts = text.split(':');
    if (textParts.length !== 2) return ''; // Invalid format

    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = textParts.join(':');

    try {
        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (err) {
        console.error('Decryption error:', err);
        return ''; // Return empty string if decryption fails
    }
};

const clientSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    notes: { type: String },
    address: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Associate with User model
    creditCardNumber: { type: String }, // Store encrypted credit card number
    creditCardExpiry: { type: String },
    creditCardCVV: { type: String }
});

// Pre-save hook to encrypt credit card number
clientSchema.pre('save', function(next) {
    if (this.isModified('creditCardNumber')) {
        this.creditCardNumber = encrypt(this.creditCardNumber);
    }
    next();
});

// Method to decrypt credit card number
clientSchema.methods.decryptCreditCardNumber = function() {
    return decrypt(this.creditCardNumber);
};

export default mongoose.model('Client', clientSchema);
