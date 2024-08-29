// middleware/auth.js

const BASE_PATH = process.env.BASE_PATH || ''; // Use the BASE_PATH environment variable

const authMiddleware = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect(`${BASE_PATH}/auth/google`); // Redirect to login if not authenticated
};

export default authMiddleware;

