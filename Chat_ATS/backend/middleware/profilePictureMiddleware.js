// middleware/profilePictureMiddleware.js
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import crypto from "crypto";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Generate secure filename for profile pictures
const generateProfilePictureFilename = (originalname) => {
  const fileExtension = originalname.split('.').pop().toLowerCase();
  const randomName = crypto.randomBytes(16).toString('hex');
  const timestamp = Date.now();
  return `${timestamp}-${randomName}`;
};

// Cloudinary storage configuration specifically for profile pictures
const profilePictureStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "profile_pictures", // Dedicated folder for profile pictures
      allowed_formats: ["jpg", "jpeg", "png", "webp"], // Only image formats for profile pictures
      public_id: generateProfilePictureFilename(file.originalname),
      transformation: [
        {
          width: 800,
          height: 800,
          crop: "limit", // Don't upscale, but limit max size
          quality: "auto:good",
          fetch_format: "auto"
        }
      ],
      resource_type: "image"
    };
  }
});

// Enhanced file filter specifically for profile pictures
export const profilePictureFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp"
  ];

  // Check file type
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Invalid file type. Only JPEG, PNG, and WebP images are allowed for profile pictures."), false);
  }

  // Check file size (5MB limit for profile pictures)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size && file.size > maxSize) {
    return cb(new Error("File size too large. Maximum size is 5MB."), false);
  }

  cb(null, true);
};

// Create multer instance specifically for profile pictures
export const uploadProfilePicture = multer({
  storage: profilePictureStorage,
  fileFilter: profilePictureFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Only one file
  }
});

// Error handling middleware for profile picture uploads
export const handleProfilePictureErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        return res.status(400).json({ 
          error: "Profile picture size exceeds the 5MB limit." 
        });
      case "LIMIT_UNEXPECTED_FILE":
        return res.status(400).json({ 
          error: "Unexpected field. Use 'profilePicture' field name." 
        });
      default:
        return res.status(400).json({ 
          error: `Upload error: ${err.message}` 
        });
    }
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};

// Clean up profile picture on error
export const cleanupProfilePictureOnError = async (err, req, res, next) => {
  if (err && req.file && req.file.filename) {
    try {
      await cloudinary.uploader.destroy(req.file.filename);
      console.log('Cleaned up profile picture from Cloudinary:', req.file.filename);
    } catch (cleanupError) {
      console.error('Error cleaning up profile picture from Cloudinary:', cleanupError);
    }
  }
  next(err);
};

// Utility function to generate different sized profile picture URLs
export const getProfilePictureVariants = (cloudinaryId, user) => {
  if (!cloudinaryId) return null;

  const baseUrl = cloudinary.url(cloudinaryId);
  
  return {
    original: baseUrl,
    large: cloudinary.url(cloudinaryId, {
      width: 400,
      height: 400,
      crop: 'fill',
      gravity: 'face',
      quality: 'auto:good'
    }),
    medium: cloudinary.url(cloudinaryId, {
      width: 200,
      height: 200,
      crop: 'fill',
      gravity: 'face',
      quality: 'auto:good'
    }),
    small: cloudinary.url(cloudinaryId, {
      width: 100,
      height: 100,
      crop: 'fill',
      gravity: 'face',
      quality: 'auto:good'
    }),
    thumbnail: cloudinary.url(cloudinaryId, {
      width: 50,
      height: 50,
      crop: 'fill',
      gravity: 'face',
      quality: 'auto:good'
    })
  };
};