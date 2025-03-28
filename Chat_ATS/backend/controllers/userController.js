import { User } from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendVerificationEmail } from "../utils/emailService.js";
import mongoose from "mongoose";
// Load environment variables
dotenv.config();

// Generate OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

export const register = async (req, res) => {
  try {
    const { name, email, password, nickname, phone, bio, gender } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Create unverified user
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry

    let profilePicture;
    if (req.file) {
      profilePicture = `http://localhost:3000/uploads/${req.file.filename}`;
    }

    const user = new User({
      name,
      email,
      password: hashedPassword,
      nickname,
      phone,
      bio,
      gender,
      isVerified: false,
      otp,
      otpExpires,
      profilePicture: profilePicture,
    });

    await user.save();

     // Send verification email
     await sendVerificationEmail(email, otp);

    res
      .status(201)
      .json({ success: true, message: "User registered successfully",id:user._id });
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, error: "Error creating user" });
  }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    
    const user = await User.findOne({
      _id: userId,
      otp,
      otpExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully! You can now login' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).lean(); // Convert to plain object

    if (!user) return res.status(400).json({ error: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ error: "Invalid password" });

    // Remove password field from the response
    delete user.password;

    // Update user's online status on login
    await User.findByIdAndUpdate(user._id, { online: true });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, user: { id: user._id, ...user } });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    console.log(req.body);
    const userId = req.user.id;
    const { name, nickname, email, phone, bio, gender } = req.body;
    // Only include fields that are actually provided
    let updatedData = {};
    if (name !== undefined) updatedData.name = name;
    if (nickname !== undefined) updatedData.nickname = nickname;
    if (email !== undefined) updatedData.email = email;
    if (phone !== undefined) updatedData.phone = phone;
    if (bio !== undefined) updatedData.bio = bio;
    if (gender !== undefined) updatedData.gender = gender;

    // Handle profile picture update
    if (req.file) {
      updatedData.profilePicture = `http://localhost:3000/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Error updating profile" });
  }
};

// Block a user
export const blockUser = async (req, res) => {
  try {
    console.log("object");
    const user = await User.findById(req.user.id);
    const blockedUserId = req.params.userId;

    if (!user.blockedUsers.includes(blockedUserId)) {
      user.blockedUsers.push(blockedUserId);
      await user.save();
    }

    res.json({
      message: "User blocked successfully",
      blockedUsers: user.blockedUsers,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Unblock a user
export const unBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.blockedUsers = user.blockedUsers.filter(
      (id) => id.toString() !== req.params.userId
    );
    await user.save();

    res.json({
      message: "User unblocked successfully",
      blockedUsers: user.blockedUsers,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getUsers = async (req, res) => {
  try {
    // Aggregate pipeline to get users with their most recent message
    const users = await User.aggregate([
      // Exclude the current user
      { $match: { _id: { $ne: new mongoose.Types.ObjectId(req.user.id) } } },
      
      // Left join with messages collection
      {
        $lookup: {
          from: 'messages', // Make sure this matches your messages collection name
          let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ['$sender', '$$userId'] },
                    { $eq: ['$receiver', '$$userId'] }
                  ]
                }
              }
            },
            { $sort: { timestamp: -1 } }, // Sort messages by timestamp
            { $limit: 1 } // Get the most recent message
          ],
          as: 'lastMessage'
        }
      },
      
      // Unwind the lastMessage (it will be an array with one item or empty)
      { $unwind: { path: '$lastMessage', preserveNullAndEmptyArrays: true } },
      
      // Sort by the timestamp of the most recent message (most recent first)
      { $sort: { 'lastMessage.timestamp': -1 } },
      
      // Project to remove sensitive fields
      {
        $project: {
          password: 0,
          otp: 0,
          otpExpires: 0
        }
      }
    ]);

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: "Error fetching users" });
  }
};
