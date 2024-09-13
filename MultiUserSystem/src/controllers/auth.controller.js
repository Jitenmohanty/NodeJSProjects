import mongoose from "mongoose";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    let user = await User.findOne(username);
    if (user) {
      return res.status(400).json({ msg: "User has already exist" });
    }

    user = new User({ username, email, password, role });
    user.save();

    const payload = { userId: user._id };
    const token = jwt.sign(payload, proccess.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

const login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
  
      // Check if the user is blocked
      if (user.status === 'blocked') {
        return res.status(403).json({ msg: 'Your account is blocked. Contact admin.' });
      }
  
      const isMatch = await user.isPasswordCorrect(password);
      if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
  
      const payload = { userId: user.id, role: user.role };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  };
