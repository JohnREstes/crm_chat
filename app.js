//app.js

import express from 'express';
import session from 'express-session';
import passport from 'passport';
import connectFlash from 'connect-flash';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/db.js';
import authMiddleware from './middleware/auth.js';
import userMiddleware from './middleware/userMiddleware.js';

// Import routes using dynamic imports
import authRoutes from './routes/auth.js';
import clientRoutes from './routes/client.js';
import emailRoutes from './routes/email.js';

dotenv.config();
connectDB();

// Initialize Passport
import './config/passport.js';

const app = express();
const BASE_PATH = process.env.BASE_PATH || '';

// Middleware
app.use(express.static(path.join(path.dirname(''), 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(connectFlash());

// Use the userMiddleware to make `user` available in all views
app.use(userMiddleware);

// Set up view engine
app.set('view engine', 'ejs');

// Routes
app.use('/auth', authRoutes);

// Apply authentication middleware to protected routes
app.use('/client', authMiddleware, clientRoutes);
app.use('/email', authMiddleware, emailRoutes);
app.use('/bulk-email', authMiddleware, emailRoutes);

// Home route
app.get('/', (req, res) => {
    res.render('index');
});

// Redirect route for '/clients'
app.get('/clients', (req, res) => {
    res.redirect('/client'); // Redirect to the '/client' route
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.get(`${BASE_PATH}/`, (req, res) => {
    res.render('index', { basePath: BASE_PATH });
});

// Start server
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
