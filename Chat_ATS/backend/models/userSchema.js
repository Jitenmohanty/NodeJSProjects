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
  online: { type: Boolean, default: false },
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Track blocked users
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
