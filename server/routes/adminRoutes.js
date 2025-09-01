// server/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { isLoggedIn, isAdmin } = require('../middleware/authMiddleware');

// @desc    A test route to check admin access
// @route   GET /api/admin/check
// We chain the middleware: first check if logged in, then check if admin.
router.get('/check', isLoggedIn, isAdmin, (req, res) => {
    // If the request makes it here, both middleware checks have passed.
    res.status(200).json({ message: 'Success! You have admin access.' });
});

// We will add more routes here later (e.g., for creating branches, subjects, etc.)

module.exports = router;