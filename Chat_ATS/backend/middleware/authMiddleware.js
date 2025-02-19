import jwt from "jsonwebtoken"
import { User } from "../models/userSchema.js";

export const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};


export const ValidateToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    // Update user's online status on token validation
    if (user) {
      await User.findByIdAndUpdate(decoded.id, { online: true });
      io.emit('user_status_change', { userId: decoded.id, online: true });
    }
    
    res.json({ user: { id: decoded.id } });
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}