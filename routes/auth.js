const express = require('express');
const router = express.Router();
const passport = require('passport');

// Initiate Discord login
router.get('/login', passport.authenticate('discord'));

// OAuth callback
router.get('/callback', passport.authenticate('discord', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/dashboard');
});

// Logout route
router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) console.error(err);
    res.redirect('/');
  });
});

module.exports = router;