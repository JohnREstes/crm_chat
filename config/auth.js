// config/auth.js
export const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/google'); // Redirect to login if not authenticated
};
