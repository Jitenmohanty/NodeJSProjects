import mongoose from "mongoose";

const groupMessageSchema = new mongoose.Schema({
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
    fileUrl: String,
    fileName: String,
    fileType: String,
    timestamp: { type: Date, default: Date.now },
    readBy: [{ 
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      readAt: { type: Date, default: Date.now }
    }]
  });
  
  export const GroupMessage = mongoose.model('GroupMessage', groupMessageSchema);