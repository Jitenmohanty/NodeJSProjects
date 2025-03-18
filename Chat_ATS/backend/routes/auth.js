import express from "express";
import { blockUser, getUsers, Login, register, unBlockUser, updateProfile } from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/fileUploadMiddleware.js";

const router = express.Router();

// Authentication Routes
router.post("/login", Login);
router.post("/register", upload.single("profilePicture"), register);

// Profile Update Route (Handles File Upload and Other Data)
router.put("/update-profile", authenticateToken, upload.single("profilePicture"), updateProfile);
router.get("/", authenticateToken, getUsers);
router.post("/block/:userId", authenticateToken,blockUser)
router.post("/unblock/:userId", authenticateToken,unBlockUser)


export default router;
