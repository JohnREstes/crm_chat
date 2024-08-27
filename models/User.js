// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    googleId: { type: String, required: true },
    displayName: { type: String },
    email: { type: String }
});

export default mongoose.model('User', UserSchema);
