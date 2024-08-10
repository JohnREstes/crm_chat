const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            // Deprecated options removed
            serverSelectionTimeoutMS: 30000 // You can still set a timeout if needed
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    }
};

module.exports = connectDB;