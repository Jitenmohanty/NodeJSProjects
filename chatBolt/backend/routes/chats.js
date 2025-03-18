// routes/chats.js
const express = require('express');
const { Chat, User, Message } = require('../models/User');
const { protect } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// @route   GET /api/chats
// @desc    Get all chats for a user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    // Find all chats where the current user is a member
    const chats = await Chat.find({
      members: req.user._id
    })
      .populate('members', 'name email avatar isOnline lastActive')
      .populate('admin', 'name email')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });
    
    res.json(chats);
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/chats
// @desc    Create or access a one-on-one chat
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { userId } = req.body;
    
    // Validate that the requested user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if one-to-one chat already exists
    let chat = await Chat.findOne({
      isGroupChat: false,
      members: { $all: [req.user._id, userId], $size: 2 }
    })
      .populate('members', 'name email avatar isOnline lastActive')
      .populate('lastMessage');
    
    // If chat exists, return it
    if (chat) {
      return res.json(chat);
    }
    
    // Create a new chat
    chat = new Chat({
      name: 'One on One',
      isGroupChat: false,
      members: [req.user._id, userId]
    });
    
    await chat.save();
    
    // Populate and return the new chat
    chat = await Chat.findById(chat._id)
      .populate('members', 'name email avatar isOnline lastActive');
    
    res.status(201).json(chat);
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/chats/group
// @desc    Create a group chat
// @access  Private
router.post('/group', protect, async (req, res) => {
  try {
    const { name, members } = req.body;
    
    // Validate input
    if (!name || !members || !Array.isArray(members)) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    // Add current user to members list if not already included
    if (!members.includes(req.user._id.toString())) {
      members.push(req.user._id.toString());
    }
    
    // Create the group chat
    const groupChat = new Chat({
      name,
      isGroupChat: true,
      members,
      admin: req.user._id
    });
    
    await groupChat.save();
    
    // Populate and return the new group chat
    const fullGroupChat = await Chat.findById(groupChat._id)
      .populate('members', 'name email avatar isOnline lastActive')
      .populate('admin', 'name email');
    
    res.status(201).json(fullGroupChat);
  } catch (error) {
    console.error('Create group chat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/chats/group/:chatId
// @desc    Update a group chat
// @access  Private
router.put('/group/:chatId', protect, async (req, res) => {
  try {
    const { name, members } = req.body;
    const { chatId } = req.params;
    
    // Find the chat
    const chat = await Chat.findById(chatId);
    
    // Check if chat exists and is a group chat
    if (!chat || !chat.isGroupChat) {
      return res.status(404).json({ message: 'Group chat not found' });
    }
    
    // Check if user is admin
    if (chat.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only admin can update group chat' });
    }
    
    // Update chat
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { name, members },
      { new: true }
    )
      .populate('members', 'name email avatar isOnline lastActive')
      .populate('admin', 'name email')
      .populate('lastMessage');
    
    res.json(updatedChat);
  } catch (error) {
    console.error('Update group chat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/chats/:chatId
// @desc    Delete a chat
// @access  Private
router.delete('/:chatId', protect, async (req, res) => {
  try {
    const { chatId } = req.params;
    
    // Find the chat
    const chat = await Chat.findById(chatId);
    
    // Check if chat exists
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    // If group chat, check if user is admin
    if (chat.isGroupChat && chat.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only admin can delete group chat' });
    }
    
    // If one-on-one chat, check if user is a member
    if (!chat.isGroupChat && !chat.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Delete all messages in the chat
    await Message.deleteMany({ chat: chatId });
    
    // Delete the chat
    await Chat.findByIdAndDelete(chatId);
    
    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('Delete chat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;