import mongoose from "mongoose";

const FileSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: [true, "Please provide a filename"],
      trim: true,
    },
    originalName: {
      type: String,
      trim: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "File must have an owner"],
    },
    gridFsFileId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "GridFS file ID is required"],
    },
    iv: {
      type: String,
      required: [true, "IV (Initialization Vector) is required"],
      // Stored as hex string for AES-256 decryption
    },
    mimeType: {
      type: String,
      default: "application/octet-stream",
    },
    size: {
      type: Number,
      required: [true, "File size is required"],
      // Original file size in bytes
    },
    isEncrypted: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Create index for faster queries
FileSchema.index({ ownerId: 1, createdAt: -1 });
FileSchema.index({ filename: 1, ownerId: 1 });

const File = mongoose.model("File", FileSchema);

export default File;
