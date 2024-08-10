module.exports = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next(); // User is authenticated, proceed to the next middleware/route
    }
    res.redirect('/'); // User is not authenticated, redirect to the home page or login page
};
