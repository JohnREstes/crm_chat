const express = require('express');
const session = require('express-session');
const passport = require('passport');
const connectFlash = require('connect-flash');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const authMiddleware = require('./middleware/auth');
const userMiddleware = require('./middleware/userMiddleware'); // Import the middleware

dotenv.config();
connectDB();

// Initialize Passport
require('./config/passport');

const app = express();

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
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
app.use('/auth', require('./routes/auth'));

// Apply authentication middleware to protected routes
app.use('/client', authMiddleware, require('./routes/client'));
app.use('/email', authMiddleware, require('./routes/email'));
app.use('/bulk-email', authMiddleware, require('./routes/email'));

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

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
