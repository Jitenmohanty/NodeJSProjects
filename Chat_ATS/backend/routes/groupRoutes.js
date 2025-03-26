import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { 
    createGroup, 
    deleteGroup, 
    getGroups, 
    updateGroup, 
    verifyGroupPassword,
    addMembersToGroup,
    removeMemberFromGroup
} from "../controllers/groupController.js";

const router = express.Router();

// Routes for Group Management
router.post("/", authenticateToken, createGroup);
router.get("/", authenticateToken, getGroups);
router.put("/:groupId", authenticateToken, updateGroup);

router.delete("/:groupId", authenticateToken, deleteGroup);

// New Routes
router.post("/:groupId/verify-password", authenticateToken, verifyGroupPassword);
router.post("/add-member", authenticateToken, addMembersToGroup); // Admin can add members
router.post("/remove-member", authenticateToken, removeMemberFromGroup);

export default router;
