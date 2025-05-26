// import multer from "multer";
// import path from "path";
// import fs from "fs";
// import { fileURLToPath } from "url";
// import crypto from "crypto";

// // Resolve __dirname in ES Modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Define upload directory
// const UPLOAD_DIR = path.join(__dirname, "../uploads");

// // Create uploads directory if it doesn't exist
// if (!fs.existsSync(UPLOAD_DIR)) {
//   fs.mkdirSync(UPLOAD_DIR, { recursive: true });
// }

// // Secure filename generation to prevent path traversal attacks
// const generateSecureFilename = (originalname) => {
//   const fileExtension = path.extname(originalname);
//   const randomName = crypto.randomBytes(16).toString('hex');
//   const timestamp = Date.now();
//   return `${timestamp}-${randomName}${fileExtension}`;
// };

// // Multer storage configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, UPLOAD_DIR);
//   },
//   filename: (req, file, cb) => {
//     const secureFilename = generateSecureFilename(file.originalname);
//     cb(null, secureFilename);
//   }
// });

// // Enhanced file filter with MIME type validation
// export const fileFilter = (req, file, cb) => {
//   const allowedTypes = [
//     "image/jpeg",
//     "image/png",
//     "image/gif",
//     "image/webp",
//     "application/pdf",
//     "application/msword",
//     "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//     "application/vnd.ms-excel",
//     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     "text/plain",
//     "application/zip",
//     "application/x-zip-compressed"
//   ];

//   // Check if the file type is allowed
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(", ")}`), false);
//   }
// };

// // Create multer instance with file size limits
// export const upload = multer({
//   storage,
//   fileFilter,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB file size limit
//     fieldSize: 2 * 1024 * 1024, // 2MB max text field size
//     fields: 50, // Increased from 20
//     files: 5,
//     parts: 55 // Increased from 25
//   }
// });

// // File upload handler
// export const uploadFile = (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: "No file uploaded" });
//   }

//   // Generate file URL for client
//   const fileUrl = `http://localhost:3000/uploads/${req.file.filename}`;
  
//   // Return file metadata
//   res.json({
//     fileUrl,
//     fileName: req.file.originalname,
//     fileType: req.file.mimetype,
//     fileSize: req.file.size,
//     uploadedAt: new Date().toISOString()
//   });
// };

// // Multiple files upload handler
// export const uploadMultipleFiles = (req, res) => {
//   if (!req.files || req.files.length === 0) {
//     return res.status(400).json({ error: "No files uploaded" });
//   }

//   const fileData = req.files.map(file => ({
//     fileUrl: `http://localhost:3000/uploads/${file.filename}`,
//     fileName: file.originalname,
//     fileType: file.mimetype,
//     fileSize: file.size
//   }));

//   res.json({ files: fileData });
// };

// // Error handling middleware for Multer
// export const handleMulterErrors = (err, req, res, next) => {
//   if (err instanceof multer.MulterError) {
//     // Handle Multer-specific errors
//     switch (err.code) {
//       case "LIMIT_FILE_SIZE":
//         return res.status(400).json({ error: "File size exceeds the 5MB limit." });
//       case "LIMIT_FILE_COUNT":
//         return res.status(400).json({ error: "Too many files uploaded. Maximum is 5." });
//       case "LIMIT_FIELD_KEY":
//       case "LIMIT_FIELD_VALUE":
//         return res.status(400).json({ error: "Field value too long." });
//       case "LIMIT_FIELD_COUNT":
//         return res.status(400).json({ error: "Too many fields." });
//       case "LIMIT_UNEXPECTED_FILE":
//         return res.status(400).json({ error: "Unexpected field name." });
//       default:
//         return res.status(400).json({ error: `Multer error: ${err.message}` });
//     }
//   } else if (err) {
//     // Handle other errors
//     return res.status(400).json({ error: err.message });
//   }
//   next();
// };

// // Clean up uploaded files if request processing fails
// export const cleanupOnError = (err, req, res, next) => {
//   if (err && req.file) {
//     fs.unlink(req.file.path, (unlinkError) => {
//       if (unlinkError) {
//         console.error('Error deleting file:', unlinkError);
//       }
//     });
//   } else if (err && req.files) {
//     req.files.forEach(file => {
//       fs.unlink(file.path, (unlinkError) => {
//         if (unlinkError) {
//           console.error('Error deleting file:', unlinkError);
//         }
//       });
//     });
//   }
//   next(err);
// };


// fileUploadMiddleware.js
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config()


// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Secure filename generation
const generateSecureFilename = (originalname) => {
  const fileExtension = originalname.split('.').pop();
  const randomName = crypto.randomBytes(16).toString('hex');
  const timestamp = Date.now();
  return `${timestamp}-${randomName}.${fileExtension}`;
};

// Cloudinary storage configuration
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads", // Cloudinary folder name
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp", "pdf", "doc", "docx", "xls", "xlsx", "txt", "zip"],
    public_id: (req, file) => generateSecureFilename(file.originalname).split('.')[0], // Remove extension as Cloudinary adds it
    resource_type: "auto", // Automatically detect resource type
  },
});

// Local storage configuration (fallback)
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const secureFilename = generateSecureFilename(file.originalname);
    cb(null, secureFilename);
  }
});

// Enhanced file filter with MIME type validation
export const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png", 
    "image/gif",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
    "application/zip",
    "application/x-zip-compressed"
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(", ")}`), false);
  }
};

// Create multer instance with Cloudinary storage
export const upload = multer({
  storage: cloudinaryStorage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB file size limit (Cloudinary free tier supports up to 10MB)
    fieldSize: 2 * 1024 * 1024, // 2MB max text field size
    fields: 50,
    files: 5,
    parts: 55
  }
});

// Create multer instance with local storage (fallback)
export const uploadLocal = multer({
  storage: localStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit for local storage
    fieldSize: 2 * 1024 * 1024,
    fields: 50,
    files: 5,
    parts: 55
  }
});

// File upload handler for single file
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // For Cloudinary uploads, the file info is different
    const fileData = {
      fileUrl: req.file.path, // Cloudinary URL
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      cloudinaryId: req.file.filename, // Cloudinary public_id
      uploadedAt: new Date().toISOString()
    };

    res.json({
      message: "File uploaded successfully",
      ...fileData
    });
  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).json({ error: "File upload failed" });
  }
};

// Multiple files upload handler
export const uploadMultipleFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const fileData = req.files.map(file => ({
      fileUrl: file.path, // Cloudinary URL
      fileName: file.originalname,
      fileType: file.mimetype,
      fileSize: file.size,
      cloudinaryId: file.filename // Cloudinary public_id
    }));

    res.json({ 
      message: "Files uploaded successfully",
      files: fileData 
    });
  } catch (error) {
    console.error("Multiple files upload error:", error);
    res.status(500).json({ error: "Files upload failed" });
  }
};

// Delete file from Cloudinary
export const deleteFile = async (req, res) => {
  try {
    const { cloudinaryId } = req.params;
    
    if (!cloudinaryId) {
      return res.status(400).json({ error: "Cloudinary ID is required" });
    }

    const result = await cloudinary.uploader.destroy(cloudinaryId);
    
    if (result.result === 'ok') {
      res.json({ message: "File deleted successfully" });
    } else {
      res.status(404).json({ error: "File not found or already deleted" });
    }
  } catch (error) {
    console.error("File deletion error:", error);
    res.status(500).json({ error: "File deletion failed" });
  }
};

// Get file details from Cloudinary
export const getFileDetails = async (req, res) => {
  try {
    const { cloudinaryId } = req.params;
    
    if (!cloudinaryId) {
      return res.status(400).json({ error: "Cloudinary ID is required" });
    }

    const result = await cloudinary.api.resource(cloudinaryId);
    
    res.json({
      cloudinaryId: result.public_id,
      fileUrl: result.secure_url,
      format: result.format,
      fileSize: result.bytes,
      uploadedAt: result.created_at,
      width: result.width,
      height: result.height
    });
  } catch (error) {
    console.error("Get file details error:", error);
    if (error.error && error.error.http_code === 404) {
      res.status(404).json({ error: "File not found" });
    } else {
      res.status(500).json({ error: "Failed to get file details" });
    }
  }
};

// Error handling middleware for Multer
export const handleMulterErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        return res.status(400).json({ error: "File size exceeds the 10MB limit." });
      case "LIMIT_FILE_COUNT":
        return res.status(400).json({ error: "Too many files uploaded. Maximum is 5." });
      case "LIMIT_FIELD_KEY":
      case "LIMIT_FIELD_VALUE":
        return res.status(400).json({ error: "Field value too long." });
      case "LIMIT_FIELD_COUNT":
        return res.status(400).json({ error: "Too many fields." });
      case "LIMIT_UNEXPECTED_FILE":
        return res.status(400).json({ error: "Unexpected field name." });
      default:
        return res.status(400).json({ error: `Upload error: ${err.message}` });
    }
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};

// Clean up uploaded files on error (for Cloudinary, this would involve deleting from cloud)
export const cleanupOnError = async (err, req, res, next) => {
  if (err && req.file && req.file.filename) {
    try {
      await cloudinary.uploader.destroy(req.file.filename);
      console.log('Cleaned up file from Cloudinary:', req.file.filename);
    } catch (cleanupError) {
      console.error('Error cleaning up file from Cloudinary:', cleanupError);
    }
  } else if (err && req.files) {
    for (const file of req.files) {
      if (file.filename) {
        try {
          await cloudinary.uploader.destroy(file.filename);
          console.log('Cleaned up file from Cloudinary:', file.filename);
        } catch (cleanupError) {
          console.error('Error cleaning up file from Cloudinary:', cleanupError);
        }
      }
    }
  }
  next(err);
};

// Utility function to generate optimized image URLs
export const getOptimizedImageUrl = (cloudinaryId, options = {}) => {
  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto'
  } = options;

  return cloudinary.url(cloudinaryId, {
    width,
    height,
    crop,
    quality,
    fetch_format: format
  });
};
