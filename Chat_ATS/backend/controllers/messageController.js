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
      if (!req.user?.id) {
          return res.status(400).json({ error: "User not authenticated" });
      }

      let filter = {
          receiver: req.user.id,
          status: { $in: ["delivered", "sent"] },
      };

      const unreadMessages = await Message.find(filter)
          .select("_id sender text timestamp")
          .sort({ timestamp: 1 }) // Oldest messages first
          .lean();

      res.json(unreadMessages);
  } catch (error) {
      console.error("Error fetching unread messages:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
};


export const clearChat = async (req, res) => {
    try {
        const { userId, chatUserId } = req.body; // userId = who is clearing, chatUserId = other person in chat

        await Message.updateMany(
            { 
                $or: [
                    { sender: userId, receiver: chatUserId },
                    { sender: chatUserId, receiver: userId }
                ]
            },
            { $addToSet: { clearedBy: userId } } // Add user to clearedBy array
        );

        return res.status(200).json({ success: true, message: "Chat cleared successfully for this user." });
    } catch (error) {
        console.error("Error clearing chat:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};