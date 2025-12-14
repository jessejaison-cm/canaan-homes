const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ensure uploads folder exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + ext);
  }
});

const upload = multer({ storage });

// Signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  console.log('[auth] POST /signup', { name, email });
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ msg: 'User created', userId: newUser._id });
  } catch (err) {
    console.error('[auth] signup error', err);
    res.status(500).json({ msg: 'Signup failed', error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('[auth] POST /login', { email });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, 'secret_key', { expiresIn: '1d' });
    res.json({ msg: 'Login successful', token });
  } catch (err) {
    console.error('[auth] login error', err);
    res.status(500).json({ msg: 'Login failed', error: err.message });
  }
});

// Google Token Authentication
router.post('/google-token', async (req, res) => {
  console.log('[auth] POST /google-token - body keys:', Object.keys(req.body));
  try {
    const { token } = req.body;
    if (!token) {
      console.warn('[auth] google-token called without token');
      return res.status(400).json({ msg: 'No token provided' });
    }
    
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name;
    const photo = payload.picture;
    const googleId = payload.sub;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        photo,
        authProvider: 'google'
      });
    } else if (!user.googleId) {
      user.googleId = googleId;
      user.authProvider = 'google';
      await user.save();
    }

    const jwtToken = jwt.sign({ id: user._id }, 'secret_key', { expiresIn: '1d' });
    res.json({ msg: 'Google login successful', token: jwtToken });
  } catch (err) {
    console.error('[auth] Google token verification error:', err);
    res.status(400).json({ msg: 'Google authentication failed', error: err.message });
  }
});

// Save additional profile info (photo, phone, address)
router.post('/profile', upload.single('photo'), async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ msg: 'No token provided' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, 'secret_key');

    const { phone, address } = req.body;

    let photoUrl = req.body.photo || '';
    if (req.file) {
      // Build absolute URL to saved file
      photoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    await User.findByIdAndUpdate(decoded.id, { phone, address, photo: photoUrl });
    res.json({ msg: 'Profile updated', photo: photoUrl });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(400).json({ msg: 'Profile update failed', error: err.message });
  }
});

// Get logged-in user info
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ msg: 'No token provided' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, 'secret_key');

    const user = await User.findById(decoded.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error('Fetch user error:', err);
    res.status(400).json({ msg: 'Failed to fetch user', error: err.message });
  }
});

module.exports = router;
