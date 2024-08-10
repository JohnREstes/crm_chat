const express = require('express');
const passport = require('passport');
const router = express.Router();

// Route to handle Google OAuth login
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Callback route after Google has authenticated the user
router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/'
}), (req, res) => {
    res.redirect('/'); // Redirect to home page or any other page
});

// Route to handle logout
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err); // Handle logout error
        }
        res.redirect('/'); // Redirect after successful logout
    });
});

module.exports = router;
