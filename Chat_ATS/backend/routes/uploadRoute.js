// import express from "express";
// import { authenticateToken } from "../middleware/authMiddleware.js";
// import { upload } from "../middleware/fileUploadMiddleware.js";

// const router = express.Router();

// // Routes
// router.post("/file",authenticateToken, upload.single("file"), (req, res) => {
//     try {
//       if (!req.file) {
//         return res.status(400).json({ error: "No file uploaded" });
//       }
//       return res.status(201).json({
//         message: "File uploaded successfully",
//         fileUrl: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`,
//         fileName: req.file.originalname,
//         fileType: req.file.mimetype
//       });
//     } catch (error) {
//       console.error("File upload error:", error);
//       return res.status(500).json({ error: "File upload failed" });
//     }
//   });
  


// export default router;


// routes/fileRoutes.js
import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { 
  upload, 
  uploadFile, 
  uploadMultipleFiles, 
  deleteFile, 
  getFileDetails,
  handleMulterErrors,
  cleanupOnError,
  getOptimizedImageUrl 
} from "../middleware/fileUploadMiddleware.js";

const router = express.Router();

// Single file upload route
router.post("/file", 
  authenticateToken, 
  upload.single("file"), 
  handleMulterErrors,
  uploadFile,
  cleanupOnError
);

// Multiple files upload route
router.post("/files", 
  authenticateToken, 
  upload.array("files", 5), // Max 5 files
  handleMulterErrors,
  uploadMultipleFiles,
  cleanupOnError
);

// Delete file route
router.delete("/file/:cloudinaryId", 
  authenticateToken, 
  deleteFile
);

// Get file details route
router.get("/file/:cloudinaryId", 
  authenticateToken, 
  getFileDetails
);

// Get optimized image URL route
router.post("/image/optimize", authenticateToken, (req, res) => {
  try {
    const { cloudinaryId, width, height, crop, quality, format } = req.body;
    
    if (!cloudinaryId) {
      return res.status(400).json({ error: "Cloudinary ID is required" });
    }

    const optimizedUrl = getOptimizedImageUrl(cloudinaryId, {
      width,
      height,
      crop,
      quality,
      format
    });

    res.json({ 
      message: "Optimized URL generated successfully",
      optimizedUrl,
      originalId: cloudinaryId 
    });
  } catch (error) {
    console.error("Image optimization error:", error);
    res.status(500).json({ error: "Failed to generate optimized URL" });
  }
});

// Health check route for file service
router.get("/health", (req, res) => {
  res.json({ 
    message: "File upload service is running",
    cloudinary: process.env.CLOUDINARY_CLOUD_NAME ? "configured" : "not configured",
    timestamp: new Date().toISOString()
  });
});

export default router;