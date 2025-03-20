import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
    fileUrl: String,
    fileName: String,
    fileType: String,
    timestamp: { type: Date, default: Date.now },
    status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' },
    readAt: { type: Date, default: null },
    clearedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Track users who cleared chat
});

export const Message = mongoose.model("Message", messageSchema);
