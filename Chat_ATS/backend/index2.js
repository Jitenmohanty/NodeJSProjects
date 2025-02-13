require("dotenv").config();
const https = require("https");
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const env = require("./config/environment");
const session = require("express-session");
const bodyParser = require("body-parser");
const redis = require("./config/redis");
const cron = require("node-cron");
const http = require("http");
const { Server } = require('socket.io');
const db = require("./config/mongoose");
const app = express();

// Create HTTP server first
const server = env.name === "production" ? https.createServer({
  key: fs.readFileSync(`${process.env.SSL_PATH}/private.key`),
  cert: fs.readFileSync(`${process.env.SSL_PATH}/certificate.crt`),
  ca: fs.readFileSync(`${process.env.SSL_PATH}/ca.crt`),
}, app) : http.createServer(app);

// Middleware setup
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: "your_secret_key_here",
  resave: false,
  saveUninitialized: false,
}));

const passport = require("passport");
const passportJWT = require("./config/passport-jwt-startegy");
const swaggerDocs = require("./config/swagger");
const Otp2faSchema = require("./models/otp2faSchema");
const applicationProcess = require("./models/applicationProcess");
const User = require("./models/user");
const Message = require("./models/messages");

app.use(passport.initialize());
app.use(passport.session());

// CORS configuration
const corsOptions = {
  origin: env.name === "production" ? env.serverURL : "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  transports: ['websocket'], // Force WebSocket transport only
  credentials: true,
};
app.use(cors(corsOptions));

// Socket.IO setup with proper CORS
const io = new Server(server, {
  cors: corsOptions
});

// Socket.IO connection management
const connectedUsers = new Map();

const socketHandler = (socket) => {
  console.log('User connected:', socket.id);

  socket.on('user_connected', async (userId) => {
    try {
      connectedUsers.set(userId, socket.id);
      await User.findByIdAndUpdate(userId, { online: true });
      io.emit('user_status_change', { userId, online: true });
      
      const users = await User.find({}).select('_id name online');
      io.emit('users_status_update', users);
    } catch (error) {
      console.error('Error updating user status:', error);
      socket.emit('error', { message: 'Failed to update user status' });
    }
  });

  socket.on('send_message', async (data) => {
    try {
      const { senderId, receiverId, text, fileUrl, fileName, fileType } = data;
      
      const message = new Message({
        sender: senderId,
        receiver: receiverId,
        text: text || '',
        fileUrl,
        fileName,
        fileType,
        status: 'sent'
      });
      
      await message.save();

      const receiverSocketId = connectedUsers.get(receiverId);
      const senderSocketId = connectedUsers.get(senderId);

      // Confirm to sender
      if (senderSocketId) {
        io.to(senderSocketId).emit('message_sent', {
          messageId: message._id,
          status: 'sent'
        });
      }

      // Send to receiver if online
      if (receiverSocketId) {
        const sender = await User.findById(senderId).select('name');
        io.to(receiverSocketId).emit('receive_message', {
          message,
          sender
        });
        
        message.status = 'delivered';
        await message.save();
        
        if (senderSocketId) {
          io.to(senderSocketId).emit('message_status_update', {
            messageId: message._id,
            status: 'delivered'
          });
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('message_error', { error: 'Failed to send message' });
    }
  });

  socket.on('message_read', async ({ messageId, readBy }) => {
    try {
      const message = await Message.findById(messageId);
      if (message && !message.readAt) {
        message.status = 'read';
        message.readAt = new Date();
        await message.save();
        
        const senderSocketId = connectedUsers.get(message.sender.toString());
        if (senderSocketId) {
          io.to(senderSocketId).emit('message_status_update', {
            messageId,
            status: 'read',
            readAt: message.readAt
          });
        }
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
      socket.emit('error', { message: 'Failed to mark message as read' });
    }
  });

  socket.on('disconnect', async () => {
    try {
      let disconnectedUserId = null;
      for (const [userId, socketId] of connectedUsers.entries()) {
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          connectedUsers.delete(userId);
          break;
        }
      }

      if (disconnectedUserId) {
        await User.findByIdAndUpdate(disconnectedUserId, { online: false });
        io.emit('user_status_change', { userId: disconnectedUserId, online: false });
      }
    } catch (error) {
      console.error('Error handling disconnect:', error);
    }
  });
};

io.on('connection', socketHandler);

// Swagger setup
swaggerDocs(app);

// Routes and view engine setup
app.use("/", require("./routes"));
app.set("view engine", "ejs");
app.set("views", "./views");
app.use("/public", express.static(path.join(__dirname, "public")));

// OTP cleanup function
async function deleteDocuments() {
  try {
    const now = new Date();
    const adminDeletionTime = new Date();
    adminDeletionTime.setHours(23, 59, 0, 0);

    const adminDeletion = await Otp2faSchema.deleteMany({
      userType: "Admin",
      createdAt: { $lte: adminDeletionTime },
    });
    console.log(`Deleted ${adminDeletion.deletedCount} Admin OTP documents at 23:59.`);

    const deletionAfter7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const roles = ["Recruiter", "Business Developer", "HR Manager"];
    const deletedAfter7Days = await Otp2faSchema.deleteMany({
      userType: { $in: roles },
      createdAt: { $lte: deletionAfter7Days },
    });
    console.log(
      `Deleted ${deletedAfter7Days.deletedCount} OTP documents older than 7 days for userTypes: ${roles.join(", ")}.`
    );
  } catch (error) {
    console.error("Error deleting OTP documents:", error);
  }
}

// Schedule OTP cleanup
cron.schedule("59 23 * * *", deleteDocuments);

// Start server
const port = env.port || 5003;
server.listen(port, () => {
  console.log(`ATS ${env.name} Server is running on port ${port}`);
  console.log(`API docs available at ${env.name === "production" ? env.serverURL : "http://localhost"}:${port}/api-docs`);
});

// Error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});