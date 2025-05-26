import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nickname: { type: String },
  email: { type: String, unique: true, required: true },
  phone: { type: String },
  password: { type: String, required: true },
  bio: { type: String },
  gender: { type: String, enum: ["Male", "Female", "Other"], default: "Male" },
  profilePicture: { type: String }, // Store image URL or file path
   cloudinaryId: {
    type: String, // Cloudinary public_id for easy deletion and manipulation
    default: null
  },
  online: { type: Boolean, default: false },
  otp:{type:String},
  isVerified:{type:Boolean,default:false},
  otpExpires:{type:Date},
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Track blocked users
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
