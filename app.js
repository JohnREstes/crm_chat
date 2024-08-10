const express = require('express');
const session = require('express-session');
const passport = require('passport');
const connectFlash = require('connect-flash');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const authMiddleware = require('./middleware/auth');

dotenv.config();
connectDB();

require('./config/passport'); // Ensure Passport is properly configured

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(connectFlash());

app.set('view engine', 'ejs');

// Routes
app.use('/auth', require('./routes/auth'));

// Apply authentication middleware to protected routes
app.use('/client', authMiddleware, require('./routes/client'));
app.use('/email', authMiddleware, require('./routes/email'));

app.get('/', (req, res) => {
    res.render('index', { user: req.user });
});

app.get('/clients', (req, res) => {
    res.redirect('/client'); // Redirect to the '/client' route
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
