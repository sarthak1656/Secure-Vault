import mongoose from "mongoose";

const ShareSchema = new mongoose.Schema(
  {
    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
      required: [true, "File ID is required"],
    },
    shareToken: {
      type: String,
      required: [true, "Share token is required"],
      unique: true,
      // Random 64-character hex string
    },
    sharedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Shared by user ID is required"],
    },
    sharedWith: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // Can be null for public shares
    },
    expiryDate: {
      type: Date,
      required: [true, "Expiry date is required"],
      // Default: 7 days from creation
    },
    accessType: {
      type: String,
      enum: ["view", "download", "edit"],
      default: "view",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    accessCount: {
      type: Number,
      default: 0,
      // Track how many times shared file was accessed
    },
    lastAccessed: {
      type: Date,
      // Track last access time
    },
  },
  { timestamps: true },
);

// Create index for faster lookups
ShareSchema.index({ shareToken: 1 });
ShareSchema.index({ fileId: 1, isActive: 1 });
ShareSchema.index({ expiryDate: 1 });

const Share = mongoose.model("Share", ShareSchema);

export default Share;
