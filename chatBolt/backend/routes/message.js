// routes/message.js
const express = require('express');
const { Message, Chat } = require('../models/User');
const { protect } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Multer storage configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/files';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}-${file.originalname.replace(/\s/g, '-')}`;
    cb(null, fileName);
  }
});

// File filter for uploads
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  
  if (mimetype && extname) {
    return cb(null, true);
  }
  
  cb(new Error('Only image and PDF files are allowed!'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max file size
});

// @route   GET /api/messages/:chatId
// @desc    Get all messages in a chat
// @access  Private
router.get('/:chatId', protect, async (req, res) => {
  try {
    const { chatId } = req.params;
    
    // Check if chat exists and user is a member
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.members.includes(req.user._id)) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    // Get messages
    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 });
    
    // Mark messages as read by current user
    await Message.updateMany(
      { 
        chat: chatId, 
        sender: { $ne: req.user._id },
        read: { $ne: req.user._id }
      },
      { $addToSet: { read: req.user._id } }
    );
    
    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/messages
// @desc    Send a text message
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { chatId, content } = req.body;
    
    // Check if chat exists and user is a member
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.members.includes(req.user._id)) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    // Create message
    const message = new Message({
      chat: chatId,
      sender: req.user._id,
      content,
      type: 'text',
      read: [req.user._id] // Sender has read the message
    });
    
    await message.save();
    
    // Update chat's last message
    chat.lastMessage = message._id;
    chat.updatedAt = Date.now();
    await chat.save();
    
    // Populate and return the message
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name avatar');
    
    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/messages/file
// @desc    Send a file (image or PDF)
// @access  Private
router.post('/file', protect, upload.single('file'), async (req, res) => {
  try {
    const { chatId } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Check if chat exists and user is a member
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.members.includes(req.user._id)) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    // Get file path relative to server
    const filePath = req.file.path.replace(/\\/g, '/');
    
    // Determine file type
    const fileType = req.file.mimetype.startsWith('image/') ? 'image' : 'pdf';
    
    // Create message
    const message = new Message({
      chat: chatId,
      sender: req.user._id,
      content: filePath, // Store the file path
      type: fileType,
      read: [req.user._id] // Sender has read the message
    });
    
    await message.save();
    
    // Update chat's last message
    chat.lastMessage = message._id;
    chat.updatedAt = Date.now();
    await chat.save();
    
    // Populate and return the message
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name avatar');
    
    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Send file error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/messages/:messageId
// @desc    Delete a message
// @access  Private
router.delete('/:messageId', protect, async (req, res) => {
  try {
    const { messageId } = req.params;
    
    // Find the message
    const message = await Message.findById(messageId);
    
    // Check if message exists
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    // Check if user is the sender
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this message' });
    }
    
    // If message has a file, delete it
    if (message.type === 'image' || message.type === 'pdf') {
      const filePath = path.join(__dirname, '..', message.content);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    // Delete message
    await Message.findByIdAndDelete(messageId);
    
    // Update chat's last message
    const chat = await Chat.findById(message.chat);
    const lastMessage = await Message.findOne({ chat: message.chat })
      .sort({ createdAt: -1 });
    
    if (lastMessage) {
      chat.lastMessage = lastMessage._id;
    } else {
      chat.lastMessage = null;
    }
    
    await chat.save();
    
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;