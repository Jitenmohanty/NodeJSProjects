import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { getGroupMessages, getUnreadGroupMessages } from "../controllers/GroupChatController.js";

const router = express.Router();

// Routes for Group Messages
router.get("/:groupId/messages", authenticateToken, getGroupMessages);
router.get("/unread", authenticateToken, getUnreadGroupMessages);

export default router;
