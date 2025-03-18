const socketIO = require('socket.io');
const { User, Chat, Message } = require('../models/User');

let io;

module.exports = {
  init: (server, options) => {
    io = socketIO(server, options);
    return io;
  },
  
  get io() {
    if (!io) {
      throw new Error('Socket.io not initialized');
    }
    return io;
  },
  
  setupEventHandlers: () => {
    io.on('connection', async (socket) => {
      const userId = socket.user.id;
      console.log(`User connected: ${userId}`);
      
      // Add user to socket room with their ID for direct messages
      socket.join(userId);
      
      // Update user's online status
      await User.findByIdAndUpdate(userId, { isOnline: true, lastActive: new Date() });
      
      // Get user's chats and join those rooms
      const userChats = await Chat.find({
        members: userId
      });
      
      userChats.forEach(chat => {
        socket.join(chat._id.toString());
      });
      
      // Broadcast user's online status to relevant users
      socket.broadcast.emit('user:online', userId);
      
      // Listen for new messages
      socket.on('message:send', async (data) => {
        try {
          const { chatId, content, type = 'text' } = data;
          
          // Save message to database
          const newMessage = await Message.create({
            chat: chatId,
            sender: userId,
            content,
            type
          });
          
          // Populate sender info for frontend display
          const populatedMessage = await Message.findById(newMessage._id)
            .populate('sender', 'name avatar');
          
          // Update chat's last message and timestamp
          await Chat.findByIdAndUpdate(chatId, {
            lastMessage: newMessage._id,
            updatedAt: new Date()
          });
          
          // Broadcast message to the chat room
          io.to(chatId).emit('message:receive', populatedMessage);
          
          // Send notification to users who are not in the chat room
          const chat = await Chat.findById(chatId).populate('members', '_id');
          chat.members.forEach(member => {
            if (member._id.toString() !== userId) {
              io.to(member._id.toString()).emit('notification:message', {
                chatId,
                message: populatedMessage
              });
            }
          });
        } catch (error) {
          console.error('Error sending message:', error);
          socket.emit('error', 'Failed to send message');
        }
      });
      
      // Typing indicator
      socket.on('typing:start', (chatId) => {
        socket.to(chatId).emit('typing:status', { userId, status: true });
      });
      
      socket.on('typing:stop', (chatId) => {
        socket.to(chatId).emit('typing:status', { userId, status: false });
      });
      
      // Handle user disconnect
      socket.on('disconnect', async () => {
        console.log(`User disconnected: ${userId}`);
        await User.findByIdAndUpdate(userId, { 
          isOnline: false, 
          lastActive: new Date() 
        });
        
        // Broadcast user's offline status to relevant users
        socket.broadcast.emit('user:offline', userId);
      });
    });
  }
};