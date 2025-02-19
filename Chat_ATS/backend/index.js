import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import http from "http";
import { Server } from "socket.io";
import multer from "multer";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { User } from "./models/userSchema.js";
import { Message } from "./models/messageSchema.js";
import { register, Login, getUsers } from "./controllers/userController.js";
import { uploadFile, fileFilter } from "./middleware/fileUploadMiddleware.js";
import {
  getMessageById,
  getUnreadMessage,
} from "./controllers/messageController.js";

// Load environment variables
dotenv.config();

// Resolve __dirname in ES Modules
import { fileURLToPath } from "url";
import { GroupMessage } from "./models/groupMessageSchema.js";
import { Group } from "./models/groupSchema.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// MongoDB connection
mongoose.connect(`${process.env.MONGODB_URI}`);

// File upload route
app.post("/upload", upload.single("file"), uploadFile);

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Auth Routes
app.post("/register", register);

app.post("/login", Login);

app.get("/validate-token", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    // Update user's online status on token validation
    if (user) {
      await User.findByIdAndUpdate(decoded.id, { online: true });
      io.emit("user_status_change", { userId: decoded.id, online: true });
    }

    res.json({ user: { id: decoded.id } });
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

// Chat Routes
app.get("/users", authenticateToken, getUsers);

app.get("/messages/:userId", authenticateToken, getMessageById);

app.get("/unread", authenticateToken, getUnreadMessage);

// Add these new routes after your existing routes
// Group Management Routes
app.post("/groups", authenticateToken, async (req, res) => {
  try {
    const { name, description, members } = req.body;
    const group = new Group({
      name,
      description,
      creator: req.user.id,
      members: [...new Set([req.user.id, ...members])], // Ensure unique members
      admins: [req.user.id],
    });
    await group.save();
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ error: "Error creating group" });
  }
});

app.get("/groups", authenticateToken, async (req, res) => {
  try {
    const groups = await Group.find({
      members: req.user.id,
    })
      .populate("members", "name email online")
      .populate("admins", "name email");
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: "Error fetching groups" });
  }
});

app.put("/groups/:groupId", authenticateToken, async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group.admins.includes(req.user.id)) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const { name, description, members, admins } = req.body;
    const updatedGroup = await Group.findByIdAndUpdate(
      req.params.groupId,
      { name, description, members, admins },
      { new: true }
    );
    res.json(updatedGroup);
  } catch (error) {
    res.status(500).json({ error: "Error updating group" });
  }
});

app.delete("/groups/:groupId", authenticateToken, async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group.admins.includes(req.user.id)) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await Group.findByIdAndDelete(req.params.groupId);
    await GroupMessage.deleteMany({ group: req.params.groupId });
    res.json({ message: "Group deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting group" });
  }
});

// Group Messages Routes
app.get("/groups/:groupId/messages", authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const group = await Group.findById(req.params.groupId);
    if (!group.members.includes(req.user.id)) {
      return res.status(403).json({ error: "Not a member of this group" });
    }

    const messages = await GroupMessage.find({ group: req.params.groupId })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("sender", "name email");

    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ error: "Error fetching group messages" });
  }
});

// Socket.io Setup
const connectedUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("user_connected", async (userId) => {
    try {
      connectedUsers.set(userId, socket.id);
      await User.findByIdAndUpdate(userId, { online: true });
      io.emit("user_status_change", { userId, online: true });

      // Fetch and broadcast current online status of all users
      const users = await User.find({}).select("_id online");
      io.emit("users_status_update", users);
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  });

  socket.on("send_message", async (data) => {
    try {
      const { senderId, receiverId, text, fileUrl, fileName, fileType } = data;

      // Create and save the message without specifying _id
      const message = new Message({
        sender: senderId,
        receiver: receiverId,
        text: text || "",
        fileUrl,
        fileName,
        fileType,
        status: "sent",
      });

      await message.save();
      // console.log('Message saved:', message);

      // Send to receiver if online
      const receiverSocketId = connectedUsers.get(receiverId);
      if (receiverSocketId) {
        const sender = await User.findById(senderId).select("name");
        io.to(receiverSocketId).emit("receive_message", {
          message,
          sender,
        });

        // Update message status to delivered
        message.status = "delivered";
        await message.save();

        // Notify sender about delivery
        io.to(connectedUsers.get(senderId)).emit("message_status_update", {
          messageId: message._id,
          status: "delivered",
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit("message_error", { error: "Failed to send message" });
    }
  });

  socket.on("message_read", async ({ messageId, readBy, senderId }) => {
    try {
      const message = await Message.findById(messageId);
      if (
        message &&
        message.sender.toString() === senderId &&
        !message.readAt
      ) {
        message.status = "read";
        message.readAt = new Date();
        await message.save();

        const senderSocketId = connectedUsers.get(senderId);
        if (senderSocketId) {
          io.to(senderSocketId).emit("message_status_update", {
            messageId,
            status: "read",
            readAt: message.readAt,
          });
        }
      }
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  });

  socket.on("user_disconnected", async (userId) => {
    try {
      connectedUsers.delete(userId);
      await User.findByIdAndUpdate(userId, { online: false });
      io.emit("user_status_change", { userId, online: false });
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  });

  socket.on("disconnect", async () => {
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
        io.emit("user_status_change", {
          userId: disconnectedUserId,
          online: false,
        });
      }
    } catch (error) {
      console.error("Error handling disconnect:", error);
    }
  });
  // Add these socket.io handlers in your existing io.on('connection') block
  socket.on("join_group", (groupId) => {
    socket.join(`group:${groupId}`);
  });

  socket.on("leave_group", (groupId) => {
    socket.leave(`group:${groupId}`);
  });

  socket.on("send_group_message", async (data) => {
    try {
      const { groupId, senderId, text, fileUrl, fileName, fileType } = data;

      const group = await Group.findById(groupId);
      if (!group.members.includes(senderId)) {
        throw new Error("Not a member of this group");
      }

      const message = new GroupMessage({
        group: groupId,
        sender: senderId,
        text: text || "",
        fileUrl,
        fileName,
        fileType,
        readBy: [{ user: senderId }], // Mark as read by sender
      });

      await message.save();

      const populatedMessage = await GroupMessage.findById(
        message._id
      ).populate("sender", "name email");

      io.to(`group:${groupId}`).emit("receive_group_message", {
        message: populatedMessage,
      });
    } catch (error) {
      console.error("Error sending group message:", error);
      socket.emit("group_message_error", { error: "Failed to send message" });
    }
  });

  socket.on("group_message_read", async ({ messageId, userId, groupId }) => {
    try {
      const message = await GroupMessage.findById(messageId);
      if (
        message &&
        !message.readBy.some((read) => read.user.toString() === userId)
      ) {
        message.readBy.push({ user: userId });
        await message.save();

        io.to(`group:${groupId}`).emit("group_message_status_update", {
          messageId,
          readBy: message.readBy,
        });
      }
    } catch (error) {
      console.error("Error marking group message as read:", error);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
