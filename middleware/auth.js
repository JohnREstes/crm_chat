// middleware/auth.js
const authMiddleware = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect(`${BASE_PATH}/auth/google`); // Redirect to login if not authenticated
};

export default authMiddleware;

