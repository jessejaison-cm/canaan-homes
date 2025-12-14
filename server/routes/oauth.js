const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Google OAuth callback
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    try {
      const user = req.user;
      const token = jwt.sign({ id: user._id }, 'secret_key', { expiresIn: '1d' });
      
      // Redirect to frontend with token
      res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/oauth-callback?token=${token}&provider=google`);
    } catch (err) {
      console.error('Google callback error:', err);
      res.redirect('/login?error=authentication_failed');
    }
  }
);

// Google OAuth Login route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

module.exports = router;
