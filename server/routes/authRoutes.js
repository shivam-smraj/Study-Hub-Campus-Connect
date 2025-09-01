// server/routes/authRoutes.js
const express = require('express');
const passport = require('passport');
const router = express.Router();
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
// @desc    Auth with Google
// @route   GET /api/auth/google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// @desc    Google auth callback
// @route   GET /api/auth/google/callback
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: `${CLIENT_URL}/login/error` // Use variable
}), (req, res) => {
  // Successful authentication, redirect to the frontend homepage.
  res.redirect(CLIENT_URL); // Use variable
});

// @desc    Get current user
// @route   GET /api/auth/current_user
router.get('/current_user', (req, res) => {
    res.send(req.user); // req.user is populated by Passport
});

// @desc    Logout user
// @route   GET /api/auth/logout
// NEW AND IMPROVED LOGOUT
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        // After logging out of our app, destroy the session
        req.session.destroy((err) => {
            if (err) {
                console.log('Error : Failed to destroy the session during logout.', err);
            }
            // Clear the cookie from the browser
            res.clearCookie('connect.sid'); 
            // Redirect to the Google logout page, which then redirects back to our app
            // res.redirect('https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=http://localhost:3000');
            res.redirect(`https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=${CLIENT_URL}`);
        });
    });
});

module.exports = router;