import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";
import http from "http";
import dotenv from "dotenv";
import userAuth from "./routes/auth.js";
import groupRoutes from "./routes/groupRoutes.js";
import groupMessageRoutes from "./routes/groupMessageRoutes.js";
import messages from "./routes/messageRoutes.js";
import upload from "./routes/uploadRoute.js";
import { Server } from "socket.io";
import { User } from "./models/userSchema.js";
import { setupSocketIO } from "./Socket/socketHandler.js";
import botMessageRoute from "./routes/chatBotRoute.js"
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from "./utils/swagger.js";
// Load environment variables
dotenv.config();

// Initialize express app and server
const app = express();
// Swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Configure middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// MongoDB connection
mongoose
  .connect(`${process.env.MONGODB_URI}`)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));



// Auth Routes
app.use("/users", userAuth);

//upload
app.use("/upload", upload);

// Token validation endpoint
app.get("/validate-token", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    const user = await User.findById(decoded.id).select("_id online").lean();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update online status and return updated user
    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      { online: true },
      { new: true }
    ).lean();

    io.emit("user_status_change", { userId: decoded.id, online: true });

    res.json({ user: { id: decoded.id, ...updatedUser } });
  } catch (error) {
    console.error("Token validation error:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

// Chat Routes
app.use("/messages", messages);

// Group chat routes
app.use("/groups", groupRoutes);
app.use("/group-messages", groupMessageRoutes);

//chatbot route
app.use("/bot",botMessageRoute)

// Setup Socket.IO
setupSocketIO(io);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Documentation available at: http://localhost:${PORT}/api-docs`);
});
