import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { createGroup, deleteGroup, getGroups, updateGroup } from "../controllers/groupController.js";

const router = express.Router();

// Routes for Group Management
router.post("/", authenticateToken, createGroup);
router.get("/", authenticateToken, getGroups);
router.put("/:groupId", authenticateToken, updateGroup);
router.delete("/:groupId", authenticateToken, deleteGroup);

export default router;
