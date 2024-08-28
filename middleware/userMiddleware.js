// middleware/userMiddleware.js

const userMiddleware = (req, res, next) => {
    res.locals.user = req.user;
    res.locals.basePath = process.env.BASE_PATH || ''; // Ensure basePath is available in all views
    next();
};

export default userMiddleware;

