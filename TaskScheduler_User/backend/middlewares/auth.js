const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Update path as per your file structure

const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract the token from the Authorization header

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user ID to request
    req.user = decoded;

    // Optionally, fetch user data (if you want full user info)
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authenticateUser;
