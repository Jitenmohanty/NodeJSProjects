
require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// Initialize Socket.io for real-time communication
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Active users map to track online users
const activeUsers = new Map();
// Active calls map to track ongoing calls
const activeCalls = new Map();

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('New client connected');
  
  // User authentication and association with socket
  socket.on('authenticate', async (userData) => {
    try {
      const userId = userData.userId;
      // Associate this socket with the user
      activeUsers.set(userId, socket.id);
      socket.userId = userId;
      
      // Notify all clients about user's online status
      io.emit('user_status_change', { userId, isOnline: true });
      
      console.log(`User ${userId} authenticated and is now online`);
    } catch (error) {
      console.error('Authentication error:', error);
    }
  });
  
  // Handle call initiation
  socket.on('initiate_call', ({ targetId, callerId }) => {
    const targetSocketId = activeUsers.get(targetId);
    
    if (targetSocketId) {
      // Create a new call entry
      const callId = `${callerId}_${targetId}_${Date.now()}`;
      activeCalls.set(callId, {
        callerId,
        targetId,
        status: 'ringing',
        startTime: Date.now()
      });
      
      // Notify the target user about the incoming call
      io.to(targetSocketId).emit('incoming_call', {
        callId,
        callerId
      });
      
      console.log(`Call initiated: ${callerId} calling ${targetId}`);
    } else {
      // Target user is offline
      socket.emit('call_error', { 
        error: 'User is offline',
        targetId
      });
    }
  });
  
  // Handle call acceptance
  socket.on('accept_call', ({ callId, targetId }) => {
    const call = activeCalls.get(callId);
    if (call) {
      const callerSocketId = activeUsers.get(call.callerId);
      
      if (callerSocketId) {
        // Update call status
        call.status = 'connected';
        activeCalls.set(callId, call);
        
        // Notify the caller that the call was accepted
        io.to(callerSocketId).emit('call_accepted', {
          callId,
          targetId
        });
        
        console.log(`Call accepted: ${callId}`);
      }
    }
  });
  
  // Handle call rejection
  socket.on('reject_call', ({ callId, reason }) => {
    const call = activeCalls.get(callId);
    if (call) {
      const callerSocketId = activeUsers.get(call.callerId);
      
      if (callerSocketId) {
        // Notify the caller that the call was rejected
        io.to(callerSocketId).emit('call_rejected', {
          callId,
          reason
        });
        
        // Remove the call from active calls
        activeCalls.delete(callId);
        
        console.log(`Call rejected: ${callId}`);
      }
    }
  });
  
  // Handle call end
  socket.on('end_call', ({ callId }) => {
    const call = activeCalls.get(callId);
    if (call) {
      const targetSocketId = activeUsers.get(call.targetId);
      const callerSocketId = activeUsers.get(call.callerId);
      
      // Notify both parties that the call has ended
      if (targetSocketId) {
        io.to(targetSocketId).emit('call_ended', { callId });
      }
      
      if (callerSocketId) {
        io.to(callerSocketId).emit('call_ended', { callId });
      }
      
      // Remove the call from active calls
      activeCalls.delete(callId);
      
      console.log(`Call ended: ${callId}`);
    }
  });
  
  // Handle WebRTC signaling
  socket.on('ice_candidate', ({ targetId, candidate }) => {
    const targetSocketId = activeUsers.get(targetId);
    if (targetSocketId) {
      io.to(targetSocketId).emit('ice_candidate', {
        candidate,
        from: socket.userId
      });
    }
  });
  
  socket.on('sdp_offer', ({ targetId, offer }) => {
    const targetSocketId = activeUsers.get(targetId);
    if (targetSocketId) {
      io.to(targetSocketId).emit('sdp_offer', {
        offer,
        from: socket.userId
      });
    }
  });
  
  socket.on('sdp_answer', ({ targetId, answer }) => {
    const targetSocketId = activeUsers.get(targetId);
    if (targetSocketId) {
      io.to(targetSocketId).emit('sdp_answer', {
        answer,
        from: socket.userId
      });
    }
  });
  
  // Handle mute status updates
  socket.on('update_mute', ({ targetId, isMuted }) => {
    const targetSocketId = activeUsers.get(targetId);
    if (targetSocketId) {
      io.to(targetSocketId).emit('participant_muted', {
        participantId: socket.userId,
        isMuted
      });
    }
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    if (socket.userId) {
      // Remove user from active users
      activeUsers.delete(socket.userId);
      
      // Notify all clients about user's offline status
      io.emit('user_status_change', { 
        userId: socket.userId, 
        isOnline: false 
      });
      
      // End any active calls involving this user
      for (const [callId, call] of activeCalls.entries()) {
        if (call.callerId === socket.userId || call.targetId === socket.userId) {
          const otherUserId = call.callerId === socket.userId ? call.targetId : call.callerId;
          const otherSocketId = activeUsers.get(otherUserId);
          
          if (otherSocketId) {
            io.to(otherSocketId).emit('call_ended', { callId });
          }
          
          activeCalls.delete(callId);
        }
      }
      
      console.log(`User ${socket.userId} disconnected`);
    }
    
    console.log('Client disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
