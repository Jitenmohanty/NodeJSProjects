import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { clearChatBotMessage, getBotMessages, sendMessage } from "../controllers/botMessageController.js";

const router = express.Router();

// Routes for Group Messages
router.post("/chatbot", authenticateToken, sendMessage);
router.get("/chatbot/history", authenticateToken, getBotMessages);
router.delete("/chatbot/clear-history", authenticateToken, clearChatBotMessage);

export default router;
