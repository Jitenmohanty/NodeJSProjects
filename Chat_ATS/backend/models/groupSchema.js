// Add these new schemas after your existing schemas
import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    name: String,
    description: String,
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    password:{String},
    createdAt: { type: Date, default: Date.now }
  });
  
  export const Group = mongoose.model('Group', groupSchema);
