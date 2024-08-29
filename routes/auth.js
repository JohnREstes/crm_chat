//routes/auth.js
import express from 'express';
import passport from 'passport';

const router = express.Router();
const BASE_PATH = process.env.BASE_PATH || ''; // Use the BASE_PATH environment variable

// Middleware to ensure the user is authenticated
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect(`${BASE_PATH}/login`); // Redirect to login page if not authenticated
};

// Route to handle Google OAuth login
router.get(`/google`, passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Callback route after Google has authenticated the user
router.get(`/google/callback`, passport.authenticate('google', {
    failureRedirect: `${BASE_PATH}/login` // Redirect to login page on failure
}), (req, res) => {
    res.redirect(`${BASE_PATH}/`); // Redirect to home page or any other page after successful login
});

// Route to handle logout
router.get(`${BASE_PATH}/logout`, ensureAuthenticated, (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err); // Handle logout error
        }
        res.redirect(`${BASE_PATH}/`); // Redirect to home page after successful logout
    });
});

export default router;
