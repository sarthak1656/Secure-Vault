import Share from "../models/share.model.js";
import File from "../models/file.model.js";
import {
  generateShareToken,
  calculateShareExpiry,
  isShareExpired,
} from "../utils/token.js";
import { decryptFile } from "../utils/decrypt.js";
import { getGridFSBucket } from "../config/gridfs.js";
import mongoose from "mongoose";

/**
 * @desc Create a share link for a file
 * @route POST /api/files/:id/share
 * @body { expiresIn }
 */
const createShare = async (req, res) => {
  try {
    const fileId = req.params.id;
    const userId = req.user.userId;
    const { expiresIn = 7 } = req.body;

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

    if (fileRecord.ownerId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Can only share files you own",
      });
    }

    if (expiresIn < 1 || expiresIn > 365) {
      return res.status(400).json({
        success: false,
        message: "Expiry duration must be between 1 and 365 days",
      });
    }

    const token = generateShareToken();
    const expiresAt = calculateShareExpiry(expiresIn);

    // FIXED: Fields now match share.model.js exactly (shareToken, expiryDate)
    const share = await Share.create({
      shareToken: token,
      fileId,
      sharedBy: userId,
      expiryDate: expiresAt,
      accessCount: 0,
    });

    return res.status(201).json({
      success: true,
      message: "File shared successfully",
      share: {
        id: share._id,
        token: share.shareToken, // Mapping back to 'token' for frontend logic
        expiresAt: share.expiryDate, // Mapping back to 'expiresAt' for frontend logic
        expiresIn,
      },
    });
  } catch (error) {
    console.error("Create share error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create share",
      error: error.message,
    });
  }
};

/**
 * @desc Access a shared file using token
 * @route GET /api/share/:token
 */
const accessSharedFile = async (req, res) => {
  try {
    const { token } = req.params;

    // FIXED: Use 'shareToken' for the database lookup
    const share = await Share.findOne({ shareToken: token }).populate("fileId");

    if (!share) {
      return res.status(404).json({
        success: false,
        message: "Share not found or link is invalid",
      });
    }

    // FIXED: Use 'expiryDate' field from model
    if (isShareExpired(share.expiryDate)) {
      await Share.deleteOne({ _id: share._id });
      return res.status(410).json({
        success: false,
        message: "Share link has expired",
      });
    }

    const fileRecord = share.fileId;

    if (!fileRecord) {
      return res.status(404).json({
        success: false,
        message: "File data not found",
      });
    }

    try {
      const bucket = getGridFSBucket();
      const downloadStream = bucket.openDownloadStream(fileRecord.gridFsFileId);

      const chunks = [];
      downloadStream.on("data", (chunk) => {
        chunks.push(chunk);
      });

      downloadStream.on("end", () => {
        try {
          const encryptedBuffer = Buffer.concat(chunks);
          const decryptedBuffer = decryptFile(encryptedBuffer, fileRecord.iv);

          res.setHeader(
            "Content-Disposition",
            `attachment; filename="${fileRecord.originalName || fileRecord.filename}"`,
          );
          res.setHeader("Content-Type", fileRecord.mimeType);
          res.setHeader("Content-Length", decryptedBuffer.length);

          res.end(decryptedBuffer);

          // FIXED: Update 'lastAccessed' and 'accessCount' fields
          Share.updateOne(
            { _id: share._id },
            {
              $inc: { accessCount: 1 },
              lastAccessed: new Date(),
            },
          ).catch((err) =>
            console.error("Failed to update share access:", err),
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
    console.error("Access shared file error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to access shared file",
      error: error.message,
    });
  }
};

/**
 * @desc Get shared file metadata (without downloading)
 * @route GET /api/share/:token/metadata
 */
const getSharedFileMetadata = async (req, res) => {
  try {
    const { token } = req.params;

    // FIXED: Match field name 'shareToken'
    const share = await Share.findOne({ shareToken: token }).populate("fileId");

    if (!share) {
      return res.status(404).json({
        success: false,
        message: "Share link is invalid or file not found",
      });
    }

    // FIXED: Check 'expiryDate' field
    if (isShareExpired(share.expiryDate)) {
      await Share.deleteOne({ _id: share._id });
      return res.status(410).json({
        success: false,
        message: "Share link has expired",
      });
    }

    const fileRecord = share.fileId;

    return res.status(200).json({
      success: true,
      file: {
        filename: fileRecord.filename,
        originalName: fileRecord.originalName || fileRecord.filename,
        size: fileRecord.size,
        mimeType: fileRecord.mimeType,
        uploadedAt: fileRecord.uploadedAt,
        expiresAt: share.expiryDate,
        accessCount: share.accessCount,
      },
    });
  } catch (error) {
    console.error("Get shared file metadata error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get shared file metadata",
      error: error.message,
    });
  }
};

/**
 * @desc Revoke a share link
 */
const revokeShare = async (req, res) => {
  try {
    const shareId = req.params.id;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(shareId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid share ID",
      });
    }

    const share = await Share.findById(shareId);

    if (!share) {
      return res.status(404).json({
        success: false,
        message: "Share not found",
      });
    }

    const fileRecord = await File.findById(share.fileId);

    if (!fileRecord || fileRecord.ownerId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Can only revoke shares for files you own",
      });
    }

    await Share.findByIdAndDelete(shareId);

    return res.status(200).json({
      success: true,
      message: "Share revoked successfully",
    });
  } catch (error) {
    console.error("Revoke share error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to revoke share",
      error: error.message,
    });
  }
};

/**
 * @desc List all shares for user's files
 */
const listUserShares = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 20 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const userFiles = await File.find({ ownerId: userId }).select("_id");
    const fileIds = userFiles.map((f) => f._id);

    const shares = await Share.find({ fileId: { $in: fileIds } })
      .populate("fileId", "filename originalName size")
      .sort("-createdAt")
      .skip(skip)
      .limit(parseInt(limit));

    const totalCount = await Share.countDocuments({
      fileId: { $in: fileIds },
    });

    const activeShares = shares
      .filter((share) => !isShareExpired(share.expiryDate))
      .map((share) => ({
        id: share._id,
        token: share.shareToken, // FIXED: shareToken
        filename: share.fileId.filename,
        originalName: share.fileId.originalName,
        fileSize: share.fileId.size,
        createdAt: share.createdAt,
        expiresAt: share.expiryDate, // FIXED: expiryDate
        accessCount: share.accessCount,
        lastAccessedAt: share.lastAccessed, // FIXED: lastAccessed
      }));

    return res.status(200).json({
      success: true,
      shares: activeShares,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalCount,
        totalPages: Math.ceil(totalCount / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("List user shares error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to list shares",
      error: error.message,
    });
  }
};

export {
  createShare,
  accessSharedFile,
  getSharedFileMetadata,
  revokeShare,
  listUserShares,
};
