const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const passport = require('passport');


exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET);
    res.json({ token, user: { id: user._id, name, email, role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role },process.env.JWT_SECRET);
    res.json({ token, user: { id: user._id, name: user.name, email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add this new method for Google OAuth callback
exports.googleCallback = async (req, res) => {
  try {
    const token = jwt.sign(
      { userId: req.user._id, role: req.user.role }, 
      process.env.JWT_SECRET
    );
    
    // Redirect to frontend with token and user info
    const frontendUser = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    };
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/auth-success?token=${token}&user=${encodeURIComponent(JSON.stringify(frontendUser))}`);
  } catch (error) {
    res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
  }
};

// Google OAuth initiation
exports.googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email']
});