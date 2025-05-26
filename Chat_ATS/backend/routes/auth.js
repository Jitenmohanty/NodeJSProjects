import express from "express";
import { blockUser, getUsers, Login, register, unBlockUser, updateProfile, verifyOTP } from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { cleanupOnError, handleMulterErrors, upload } from "../middleware/fileUploadMiddleware.js";

const router = express.Router();

// Authentication Routes
router.post("/login", Login);
// User registration with optional profile picture
router.post("/register", 
  upload.single("profilePicture"), 
  handleMulterErrors,
  register,
  cleanupOnError
);

router.post('/verify-otp', verifyOTP);

// Profile Update Route (Handles File Upload and Other Data)
router.put("/update-profile", authenticateToken, upload.single("profilePicture"), 
  handleMulterErrors,
  updateProfile,
  cleanupOnError);
router.get("/", authenticateToken, getUsers);
router.post("/block/:userId", authenticateToken,blockUser)
router.post("/unblock/:userId", authenticateToken,unBlockUser)


export default router;
