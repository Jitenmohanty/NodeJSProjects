
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Call = require('../models/Call');
const router = express.Router();

// Middleware to authenticate token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Authorization denied' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Add user to request
    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users except current user
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.userId } })
      .select('-password')
      .sort({ isOnline: -1, name: 1 });
    
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user's online status
router.put('/status', auth, async (req, res) => {
  try {
    const { isOnline } = req.body;
    
    // Update user's online status
    const user = await User.findByIdAndUpdate(
      req.userId,
      { isOnline },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get call history for a user
router.get('/calls/history', auth, async (req, res) => {
  try {
    const calls = await Call.find({
      $or: [
        { callerId: req.userId },
        { receiverId: req.userId }
      ]
    })
    .populate('callerId', 'name avatar')
    .populate('receiverId', 'name avatar')
    .sort({ createdAt: -1 });
    
    res.json(calls);
  } catch (error) {
    console.error('Get call history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Record a call
router.post('/calls', auth, async (req, res) => {
  try {
    const { receiverId, startTime, endTime, status } = req.body;
    
    const call = new Call({
      callerId: req.userId,
      receiverId,
      startTime,
      endTime,
      status
    });
    
    await call.save();
    res.status(201).json(call);
  } catch (error) {
    console.error('Record call error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
