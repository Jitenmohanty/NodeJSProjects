const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const Flag = require('../models/Flag');

// Create a new feature flag
router.post('/flags', authenticate, async (req, res) => {
  try {
    const flag = new Flag(req.body);
    await flag.save();
    res.status(201).json(flag);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// List all feature flags
router.get('/flags', authenticate, async (req, res) => {
  try {
    const flags = await Flag.find();
    res.json(flags);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Retrieve a specific feature flag
router.get('/flags/:id', authenticate, async (req, res) => {
  try {
    const flag = await Flag.findById(req.params.id);
    if (!flag) return res.status(404).json({ message: 'Flag not found' });
    res.json(flag);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a feature flag
router.put('/flags/:id', authenticate, async (req, res) => {
  try {
    const flag = await Flag.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!flag) return res.status(404).json({ message: 'Flag not found' });
    res.json(flag);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a feature flag
router.delete('/flags/:id', authenticate, async (req, res) => {
  try {
    const flag = await Flag.findByIdAndDelete(req.params.id);
    if (!flag) return res.status(404).json({ message: 'Flag not found' });
    res.json({ message: 'Flag deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;