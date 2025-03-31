const express = require('express');
const router = express.Router();

// Middleware to protect routes (admin only)
function checkAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

// Dashboard homepage route
router.get('/dashboard', checkAuth, (req, res) => {
  res.render('index', { user: req.user });
});

// Root route (can redirect to dashboard or login)
router.get('/', (req, res) => {
  res.redirect('/dashboard');
});

module.exports = router;