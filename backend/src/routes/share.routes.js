import express from "express";
import {
  createShare,
  accessSharedFile,
  getSharedFileMetadata,
  revokeShare,
  listUserShares,
} from "../controllers/share.controller.js";
import { authenticateJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes (no auth required for accessing shared files)
router.get("/share/:token", accessSharedFile);
router.get("/share/:token/metadata", getSharedFileMetadata);

// Protected routes (auth required)
router.post("/:id/share", authenticateJWT, createShare);
router.get("/user/shares", authenticateJWT, listUserShares);
router.delete("/share/:id", authenticateJWT, revokeShare);

export default router;
