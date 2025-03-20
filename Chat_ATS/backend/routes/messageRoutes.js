import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { getMessageById, getUnreadMessage } from "../controllers/messageController.js";

const router = express.Router();

router.get("/unread", authenticateToken, getUnreadMessage);
router.get("/:userId", authenticateToken, getMessageById);


export default router;
