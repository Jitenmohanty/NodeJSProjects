import mongoose from "mongoose";

const botMessageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Store which user sent the message
    userMessage: { type: String, required: true }, // User input
    botResponse: { type: String, required: true }, // Gemini AI response
  },
  { timestamps: true }
);

const BotMessage = mongoose.model("BotMessage", botMessageSchema);
export default BotMessage;
