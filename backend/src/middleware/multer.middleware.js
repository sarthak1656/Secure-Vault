import multer from "multer";

// Configure multer to store files in memory (not disk)
// This allows us to encrypt before storage
const storage = multer.memoryStorage();

// File filter - validate file uploads
const fileFilter = (req, file, cb) => {
  // Allow all file types for secure storage
  // File validation can be enhanced based on requirements

  // Check file size in middleware
  cb(null, true);
};

// Initialize multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    // FIXED: Lowered to 50MB to prevent server crash (Heap OOM)
    // Memory storage cannot handle 5GB files.
    fileSize: 50 * 1024 * 1024, 
  },
});

/**
 * Middleware to handle single file upload
 */
const uploadSingleFile = upload.single("file");

/**
 * Middleware to handle multiple files upload
 */
const uploadMultipleFiles = upload.array("files", 10);

/**
 * Middleware to validate file upload
 */
const validateFileUpload = (req, res, next) => {
  try {
    if (!req.file && !req.files) {
      return res.status(400).json({
        success: false,
        message: "No file provided",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "File validation failed",
      error: error.message,
    });
  }
};

export {
  upload as uploadMiddleware,
  uploadSingleFile,
  uploadMultipleFiles,
  validateFileUpload,
};