import mongoose from "mongoose";
// MongoDB Schemas

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  online: { type: Boolean, default: false }
});


export const User = mongoose.model('User', userSchema);