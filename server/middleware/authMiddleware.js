// server/middleware/authMiddleware.js

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'You must be logged in!' });
    }
    next();
};

module.exports.isAdmin = (req, res, next) => {
    // We assume isLoggedIn has already been run, so req.user exists.
    // We check if the user's email matches the one in our .env file.
    if (req.user.email !== process.env.ADMIN_EMAIL) {
        return res.status(403).json({ message: 'Forbidden: You are not authorized to perform this action.' });
    }
    // If they are the admin, proceed to the next function.
    next();
};