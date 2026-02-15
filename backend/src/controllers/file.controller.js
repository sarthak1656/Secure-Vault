import File from "../models/file.model.js";
import Share from "../models/share.model.js";
import User from "../models/user.model.js";
import { encryptFile } from "../utils/encrypt.js";
import { decryptFile } from "../utils/decrypt.js";
import { getGridFSBucket } from "../config/gridfs.js";
import mongoose from "mongoose";

/**
 * @desc Upload a file
 * @route POST /files/upload
 * @body { originalname, buffer, mimetype, size }
 */
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file provided",
      });
    }

    const { filename } = req.body;
    const userId = req.user.userId;

    // Validate filename
    if (!filename) {
      return res.status(400).json({
        success: false,
        message: "Filename is required",
      });
    }

    // 1. Check User and Quota
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check storage limit (Default 5GB if not set on user)
    const MAX_STORAGE = user.storageLimit || 5 * 1024 * 1024 * 1024;

    // Check if adding this file would exceed the limit
    if (user.storageUsed + req.file.size > MAX_STORAGE) {
      return res.status(413).json({
        success: false,
        message: "Storage quota exceeded",
        currentUsage: user.storageUsed,
        maxLimit: MAX_STORAGE,
      });
    }

    // Encrypt file buffer
    const { encryptedData, iv } = encryptFile(req.file.buffer);

    // Upload encrypted file to GridFS
    const bucket = getGridFSBucket();
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: req.file.mimetype,
    });

    return new Promise((resolve) => {
      uploadStream.end(encryptedData, async (error, file) => {
        if (error) {
          console.error("GridFS upload error:", error);
          return resolve(
            res.status(500).json({
              success: false,
              message: "File upload failed",
              error: error.message,
            }),
          );
        }

        try {
          // Create database record
          const fileRecord = await File.create({
            filename,
            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
            size: req.file.size,
            gridFsFileId: file._id, 
            iv: iv,
            ownerId: userId,
            uploadedAt: new Date(),
          });

          // Atomic Update to prevent Race Conditions
          await User.findByIdAndUpdate(userId, {
            $inc: { storageUsed: req.file.size },
          });

          resolve(
            res.status(201).json({
              success: true,
              message: "File uploaded successfully",
              file: {
                id: fileRecord._id,
                filename: fileRecord.filename,
                originalName: fileRecord.originalName,
                size: fileRecord.size,
                mimeType: fileRecord.mimeType,
                uploadedAt: fileRecord.uploadedAt,
              },
            }),
          );
        } catch (dbError) {
          // Clean up GridFS file if DB fails
          bucket.delete(file._id).catch(() => {});

          console.error("Database error:", dbError);
          resolve(
            res.status(500).json({
              success: false,
              message: "Failed to save file metadata",
              error: dbError.message,
            }),
          );
        }
      });
    });
  } catch (error) {
    console.error("Upload file error:", error);
    return res.status(500).json({
      success: false,
      message: "File upload failed",
      error: error.message,
    });
  }
};

/**
 * @desc Download a file
 * @route GET /files/:id
 */
const downloadFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const userId = req.user.userId;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid file ID",
      });
    }

    const fileRecord = await File.findById(fileId);

    if (!fileRecord) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // Check ownership (unless admin)
    if (fileRecord.ownerId.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    try {
      const bucket = getGridFSBucket();
      const downloadStream = bucket.openDownloadStream(fileRecord.gridFsFileId);

      // Collect encrypted chunks
      const chunks = [];
      downloadStream.on("data", (chunk) => {
        chunks.push(chunk);
      });

      downloadStream.on("end", () => {
        try {
          const encryptedBuffer = Buffer.concat(chunks);

          // Decrypt file
          const decryptedBuffer = decryptFile(encryptedBuffer, fileRecord.iv);

          // Set response headers
          res.setHeader(
            "Content-Disposition",
            // ✨ FIXED: Removed 'secure-file'. Use the database filename so the extension is saved.
            `attachment; filename="${fileRecord.originalName || fileRecord.filename || 'download'}"`,
          );
          
          res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
          res.setHeader("Content-Type", fileRecord.mimeType || "application/octet-stream");
          res.setHeader("Content-Length", decryptedBuffer.length);

          // Send decrypted file
          res.end(decryptedBuffer);

          // Update last accessed time in background
          File.updateOne({ _id: fileId }, { lastAccessedAt: new Date() }).catch(
            (err) => console.error("Failed to update last accessed time:", err),
          );
        } catch (decryptError) {
          console.error("Decryption error:", decryptError);
          res.status(500).json({
            success: false,
            message: "Failed to decrypt file",
            error: decryptError.message,
          });
        }
      });

      downloadStream.on("error", (error) => {
        console.error("GridFS download error:", error);
        res.status(500).json({
          success: false,
          message: "Failed to download file",
          error: error.message,
        });
      });
    } catch (gridfsError) {
      console.error("GridFS error:", gridfsError);
      return res.status(500).json({
        success: false,
        message: "File download failed",
        error: gridfsError.message,
      });
    }
  } catch (error) {
    console.error("Download file error:", error);
    return res.status(500).json({
      success: false,
      message: "File download failed",
      error: error.message,
    });
  }
};

/**
 * @desc Get file metadata
 * @route GET /files/:id/metadata
 */
const getFileMetadata = async (req, res) => {
  try {
    const fileId = req.params.id;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid file ID",
      });
    }

    const fileRecord = await File.findById(fileId);

    if (!fileRecord) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // Check ownership (unless admin)
    if (fileRecord.ownerId.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    return res.status(200).json({
      success: true,
      file: {
        id: fileRecord._id,
        filename: fileRecord.filename,
        originalName: fileRecord.originalName,
        size: fileRecord.size,
        mimeType: fileRecord.mimeType,
        uploadedAt: fileRecord.uploadedAt,
        lastAccessedAt: fileRecord.lastAccessedAt,
      },
    });
  } catch (error) {
    console.error("Get file metadata error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get file metadata",
      error: error.message,
    });
  }
};

/**
 * @desc Delete a file
 * @route DELETE /files/:id
 */
const deleteFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid file ID",
      });
    }

    const fileRecord = await File.findById(fileId);

    if (!fileRecord) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // Check ownership (unless admin)
    if (fileRecord.ownerId.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    try {
      // Delete from GridFS
      const bucket = getGridFSBucket();
      await bucket.delete(fileRecord.gridFsFileId);

      // Delete from database
      await File.findByIdAndDelete(fileId);

      // Delete associated shares
      await Share.deleteMany({ fileId });

      // Atomic Update for deletion
      await User.findByIdAndUpdate(fileRecord.ownerId, {
        $inc: { storageUsed: -fileRecord.size },
      });

      return res.status(200).json({
        success: true,
        message: "File deleted successfully",
      });
    } catch (gridfsError) {
      console.error("GridFS delete error:", gridfsError);
      return res.status(500).json({
        success: false,
        message: "Failed to delete file",
        error: gridfsError.message,
      });
    }
  } catch (error) {
    console.error("Delete file error:", error);
    return res.status(500).json({
      success: false,
      message: "File deletion failed",
      error: error.message,
    });
  }
};

/**
 * @desc List user's files
 * @route GET /files/my/list
 */
const listUserFiles = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 20, sort = "-uploadedAt" } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const files = await File.find({ ownerId: userId })
      .select("filename originalName size mimeType uploadedAt lastAccessedAt")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const totalCount = await File.countDocuments({ ownerId: userId });

    return res.status(200).json({
      success: true,
      files,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalCount,
        totalPages: Math.ceil(totalCount / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("List user files error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to list files",
      error: error.message,
    });
  }
};

/**
 * @desc Search user's files
 * @route GET /files/search
 */
const searchFiles = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { query, mimeType } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const searchFilter = {
      ownerId: userId,
      $or: [
        { filename: { $regex: query, $options: "i" } },
        { originalName: { $regex: query, $options: "i" } },
      ],
    };

    if (mimeType) {
      searchFilter.mimeType = mimeType;
    }

    const files = await File.find(searchFilter)
      .select("filename originalName size mimeType uploadedAt lastAccessedAt")
      .limit(50);

    return res.status(200).json({
      success: true,
      results: files,
      count: files.length,
    });
  } catch (error) {
    console.error("Search files error:", error);
    return res.status(500).json({
      success: false,
      message: "File search failed",
      error: error.message,
    });
  }
};

export {
  uploadFile,
  downloadFile,
  getFileMetadata,
  deleteFile,
  listUserFiles,
  searchFiles,
};