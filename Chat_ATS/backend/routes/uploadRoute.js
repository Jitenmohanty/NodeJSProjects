import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/fileUploadMiddleware.js";

const router = express.Router();

// Routes
router.post("/file",authenticateToken, upload.single("file"), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      return res.status(201).json({
        message: "File uploaded successfully",
        fileUrl: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`,
        fileName: req.file.originalname,
        fileType: req.file.mimetype
      });
    } catch (error) {
      console.error("File upload error:", error);
      return res.status(500).json({ error: "File upload failed" });
    }
  });
  


export default router;
