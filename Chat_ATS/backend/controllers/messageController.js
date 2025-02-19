import { Message } from "../models/messageSchema.js";

export const getMessageById = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query; // Default to first page, 20 messages per request
    const skip = (page - 1) * limit; // Calculate how many messages to skip

    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user.id }
      ]
    })
    .sort({ timestamp: -1 }) // Sort by latest messages first
    .skip(skip)
    .limit(parseInt(limit)); // Convert limit to a number

    res.json(messages.reverse()); // Reverse to show oldest at the top
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: 'Error fetching messages' });
  }
}

export const getUnreadMessage = async (req, res) => {
    try {
  
      let filter = {
        receiver: req.user?.id, 
        status: { $in: ["delivered", "sent"] },
      };
  
      const unreadMessages = await Message.find(filter)
      .select("sender text timestamp")
  
      res.json(unreadMessages);
    } catch (error) {
      console.error("Error fetching unread messages:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }