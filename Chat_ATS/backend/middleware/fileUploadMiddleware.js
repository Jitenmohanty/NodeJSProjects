import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import crypto from "crypto";

// Resolve __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define upload directory
const UPLOAD_DIR = path.join(__dirname, "../uploads");

// Create uploads directory if it doesn't exist
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Secure filename generation to prevent path traversal attacks
const generateSecureFilename = (originalname) => {
  const fileExtension = path.extname(originalname);
  const randomName = crypto.randomBytes(16).toString('hex');
  const timestamp = Date.now();
  return `${timestamp}-${randomName}${fileExtension}`;
};

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
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

  // Check if the file type is allowed
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(", ")}`), false);
  }
};

// Create multer instance with file size limits
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
    fieldSize: 2 * 1024 * 1024, // 2MB max text field size
    fields: 50, // Increased from 20
    files: 5,
    parts: 55 // Increased from 25
  }
});

// File upload handler
export const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Generate file URL for client
  const fileUrl = `http://localhost:3000/uploads/${req.file.filename}`;
  
  // Return file metadata
  res.json({
    fileUrl,
    fileName: req.file.originalname,
    fileType: req.file.mimetype,
    fileSize: req.file.size,
    uploadedAt: new Date().toISOString()
  });
};

// Multiple files upload handler
export const uploadMultipleFiles = (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }

  const fileData = req.files.map(file => ({
    fileUrl: `http://localhost:3000/uploads/${file.filename}`,
    fileName: file.originalname,
    fileType: file.mimetype,
    fileSize: file.size
  }));

  res.json({ files: fileData });
};

// Error handling middleware for Multer
export const handleMulterErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Handle Multer-specific errors
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        return res.status(400).json({ error: "File size exceeds the 5MB limit." });
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
        return res.status(400).json({ error: `Multer error: ${err.message}` });
    }
  } else if (err) {
    // Handle other errors
    return res.status(400).json({ error: err.message });
  }
  next();
};

// Clean up uploaded files if request processing fails
export const cleanupOnError = (err, req, res, next) => {
  if (err && req.file) {
    fs.unlink(req.file.path, (unlinkError) => {
      if (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    });
  } else if (err && req.files) {
    req.files.forEach(file => {
      fs.unlink(file.path, (unlinkError) => {
        if (unlinkError) {
          console.error('Error deleting file:', unlinkError);
        }
      });
    });
  }
  next(err);
};

// Usage examples:

// For single file upload: 
// app.post('/upload', upload.single('file'), handleMulterErrors, uploadFile);

// For multiple files upload:
// app.post('/upload-multiple', upload.array('files', 5), handleMulterErrors, uploadMultipleFiles);

// For multiple fields with multiple files:
// const multiUpload = upload.fields([
//   { name: 'avatar', maxCount: 1 },
//   { name: 'documents', maxCount: 3 }
// ]);
// app.post('/profile-upload', multiUpload, handleMulterErrors, (req, res) => { ... });

// To use cleanup middleware:
// app.use(cleanupOnError);