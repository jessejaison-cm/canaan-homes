const express = require('express');
const jwt = require('jsonwebtoken');
const BookingRequest = require('../models/BookingRequest');

const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ msg: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, 'secret_key');
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};

// Submit booking or buy request
router.post('/submit', verifyToken, async (req, res) => {
  try {
    const { listingId, listingTitle, listingPrice, requestType, name, email, phone, message } = req.body;

    if (!listingId || !requestType || !name || !email || !phone) {
      return res.status(400).json({ msg: 'Missing required fields' });
    }

    const newRequest = new BookingRequest({
      userId: req.userId,
      listingId,
      listingTitle,
      listingPrice,
      requestType,
      name,
      email,
      phone,
      message: message || '',
    });

    await newRequest.save();
    res.status(201).json({ msg: 'Request submitted successfully', request: newRequest });
  } catch (err) {
    console.error('Submit request error:', err);
    res.status(500).json({ msg: 'Failed to submit request', error: err.message });
  }
});

// Get user's booking requests
router.get('/my-requests', verifyToken, async (req, res) => {
  try {
    const requests = await BookingRequest.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error('Fetch requests error:', err);
    res.status(500).json({ msg: 'Failed to fetch requests', error: err.message });
  }
});

// Get all requests (admin only)
router.get('/all-requests', verifyToken, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.userId);
    
    if (!user || !user.isAdmin) {
      return res.status(403).json({ msg: 'Access denied. Admin only.' });
    }

    const requests = await BookingRequest.find().populate('userId', 'name email phone').sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error('Fetch all requests error:', err);
    res.status(500).json({ msg: 'Failed to fetch requests', error: err.message });
  }
});

// Update request status (admin only)
router.patch('/update-status/:id', verifyToken, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.userId);
    
    if (!user || !user.isAdmin) {
      return res.status(403).json({ msg: 'Access denied. Admin only.' });
    }

    const { status } = req.body;
    if (!['pending', 'contacted', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status' });
    }

    const updated = await BookingRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) return res.status(404).json({ msg: 'Request not found' });
    res.json({ msg: 'Status updated', request: updated });
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ msg: 'Failed to update status', error: err.message });
  }
});

module.exports = router;
