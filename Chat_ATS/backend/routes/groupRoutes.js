import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { 
    createGroup, 
    deleteGroup, 
    getGroups, 
    updateGroup, 
    addMemberToGroup, 
    verifyGroupPassword
} from "../controllers/groupController.js";

const router = express.Router();

// Routes for Group Management
router.post("/", authenticateToken, createGroup);
router.get("/", authenticateToken, getGroups);
router.put("/:groupId", authenticateToken, updateGroup);
router.delete("/:groupId", authenticateToken, deleteGroup);

// New Routes
router.post("/:groupId/verify-password", authenticateToken, verifyGroupPassword);
router.post("/add-member", authenticateToken, addMemberToGroup); // Admin can add members

export default router;
