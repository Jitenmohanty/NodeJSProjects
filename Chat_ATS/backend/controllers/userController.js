import { User } from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendVerificationEmail } from "../utils/emailService.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
// Load environment variables
dotenv.config();

// Generate OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Configure Cloudinary (make sure this is also in your main app file)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to delete old profile picture from Cloudinary
const deleteOldProfilePicture = async (oldImageUrl) => {
  try {
    if (oldImageUrl && oldImageUrl.includes("cloudinary.com")) {
      // Extract public_id from Cloudinary URL
      const publicId = oldImageUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`profile_pictures/${publicId}`);
      console.log("Old profile picture deleted:", publicId);
    }
  } catch (error) {
    console.error("Error deleting old profile picture:", error);
    // Don't throw error, just log it as it's not critical
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password, nickname, phone, bio, gender } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // If user uploaded a file but registration fails, clean up
      if (req.file && req.file.filename) {
        try {
          await cloudinary.uploader.destroy(req.file.filename);
        } catch (cleanupError) {
          console.error("Error cleaning up uploaded file:", cleanupError);
        }
      }
      return res.status(400).json({ message: "Email already exists" });
    }

    // Create unverified user
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry

    let profilePicture = null;
    let cloudinaryId = null;

    // Handle profile picture upload with Cloudinary
    if (req.file) {
      try {
        profilePicture = req.file.path; // Cloudinary URL
        cloudinaryId = req.file.filename; // Cloudinary public_id
        console.log("Profile picture uploaded to Cloudinary:", profilePicture);
      } catch (uploadError) {
        console.error("Error processing uploaded file:", uploadError);
        return res.status(500).json({
          success: false,
          error: "Error processing profile picture",
        });
      }
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
      profilePicture,
      cloudinaryId, // Store Cloudinary public_id for future reference
    });

    await user.save();

    // Send verification email
    await sendVerificationEmail(email, otp);

    // Return user data without sensitive information
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      nickname: user.nickname,
      phone: user.phone,
      bio: user.bio,
      gender: user.gender,
      profilePicture: user.profilePicture,
      isVerified: user.isVerified,
    };

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Registration error:", error);

    // Clean up uploaded file if registration fails
    if (req.file && req.file.filename) {
      try {
        await cloudinary.uploader.destroy(req.file.filename);
        console.log("Cleaned up uploaded file after registration error");
      } catch (cleanupError) {
        console.error("Error cleaning up uploaded file:", cleanupError);
      }
    }

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
      otpExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ message: "Email verified successfully! You can now login" });
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
    console.log('Update profile request:', req.body);
    const userId = req.user.id;
    const { name, nickname, email, phone, bio, gender } = req.body;

    // Get current user data to handle profile picture cleanup
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      // Clean up newly uploaded file if user not found
      if (req.file && req.file.filename) {
        try {
          await cloudinary.uploader.destroy(req.file.filename);
        } catch (cleanupError) {
          console.error('Error cleaning up uploaded file:', cleanupError);
        }
      }
      return res.status(404).json({ error: "User not found" });
    }

    // Only include fields that are actually provided
    let updatedData = {};
    if (name !== undefined) updatedData.name = name;
    if (nickname !== undefined) updatedData.nickname = nickname;
    if (email !== undefined) {
      // Check if new email already exists (if different from current)
      if (email !== currentUser.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          // Clean up newly uploaded file if email exists
          if (req.file && req.file.filename) {
            try {
              await cloudinary.uploader.destroy(req.file.filename);
            } catch (cleanupError) {
              console.error('Error cleaning up uploaded file:', cleanupError);
            }
          }
          return res.status(400).json({ error: "Email already exists" });
        }
      }
      updatedData.email = email;
    }
    if (phone !== undefined) updatedData.phone = phone;
    if (bio !== undefined) updatedData.bio = bio;
    if (gender !== undefined) updatedData.gender = gender;

    // Handle profile picture update
    if (req.file) {
      try {
        // Delete old profile picture if it exists
        if (currentUser.cloudinaryId) {
          await deleteOldProfilePicture(currentUser.profilePicture);
        }

        // Set new profile picture data
        updatedData.profilePicture = req.file.path; // Cloudinary URL
        updatedData.cloudinaryId = req.file.filename; // Cloudinary public_id
        
        console.log('New profile picture uploaded:', updatedData.profilePicture);
      } catch (uploadError) {
        console.error('Error processing profile picture:', uploadError);
        return res.status(500).json({ error: "Error processing profile picture" });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
      runValidators: true
    }).select('-password -otp -otpExpires'); // Exclude sensitive fields

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ 
      message: "Profile updated successfully", 
      user: updatedUser 
    });
  } catch (error) {
    console.error("Profile update error:", error);
    
    // Clean up newly uploaded file if update fails
    if (req.file && req.file.filename) {
      try {
        await cloudinary.uploader.destroy(req.file.filename);
        console.log('Cleaned up uploaded file after update error');
      } catch (cleanupError) {
        console.error('Error cleaning up uploaded file:', cleanupError);
      }
    }
    
    res.status(500).json({ error: "Error updating profile" });
  }
};

// Additional helper function to delete user profile picture
export const deleteProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.profilePicture || !user.cloudinaryId) {
      return res.status(400).json({ error: "No profile picture to delete" });
    }

    // Delete from Cloudinary
    await deleteOldProfilePicture(user.profilePicture);

    // Update user document
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        $unset: { 
          profilePicture: 1, 
          cloudinaryId: 1 
        } 
      },
      { new: true }
    ).select('-password -otp -otpExpires');

    res.json({ 
      message: "Profile picture deleted successfully", 
      user: updatedUser 
    });
  } catch (error) {
    console.error("Delete profile picture error:", error);
    res.status(500).json({ error: "Error deleting profile picture" });
  }
};

// Function to get optimized profile picture URL
export const getOptimizedProfilePicture = async (req, res) => {
  try {
    const { userId } = req.params;
    const { width = 200, height = 200, quality = "auto" } = req.query;

    const user = await User.findById(userId).select('profilePicture cloudinaryId');
    if (!user || !user.cloudinaryId) {
      return res.status(404).json({ error: "Profile picture not found" });
    }

    // Generate optimized URL
    const optimizedUrl = cloudinary.url(user.cloudinaryId, {
      width: parseInt(width),
      height: parseInt(height),
      crop: 'fill',
      gravity: 'face', // Focus on face for profile pictures
      quality,
      fetch_format: 'auto'
    });

    res.json({ 
      optimizedUrl,
      originalUrl: user.profilePicture 
    });
  } catch (error) {
    console.error("Get optimized profile picture error:", error);
    res.status(500).json({ error: "Error generating optimized profile picture" });
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
          from: "messages", // Make sure this matches your messages collection name
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ["$sender", "$$userId"] },
                    { $eq: ["$receiver", "$$userId"] },
                  ],
                },
              },
            },
            { $sort: { timestamp: -1 } }, // Sort messages by timestamp
            { $limit: 1 }, // Get the most recent message
          ],
          as: "lastMessage",
        },
      },

      // Unwind the lastMessage (it will be an array with one item or empty)
      { $unwind: { path: "$lastMessage", preserveNullAndEmptyArrays: true } },

      // Sort by the timestamp of the most recent message (most recent first)
      { $sort: { "lastMessage.timestamp": -1 } },

      // Project to remove sensitive fields
      {
        $project: {
          password: 0,
          otp: 0,
          otpExpires: 0,
        },
      },
    ]);

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
};
