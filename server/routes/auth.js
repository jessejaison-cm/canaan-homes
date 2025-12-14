const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');

const router = express.Router();

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
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ msg: 'User created', userId: newUser._id });
  } catch (err) {
    res.status(500).json({ msg: 'Signup failed', error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, 'secret_key', { expiresIn: '1d' });
    res.json({ msg: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ msg: 'Login failed', error: err.message });
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
