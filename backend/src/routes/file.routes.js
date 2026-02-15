import express from "express";
import {
  uploadFile,
  downloadFile,
  getFileMetadata,
  deleteFile,
  listUserFiles,
  searchFiles,
} from "../controllers/file.controller.js";
import { authenticateJWT } from "../middleware/auth.middleware.js";
import { uploadMiddleware } from "../middleware/multer.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateJWT);

// File operations
router.post("/upload", uploadMiddleware.single("file"), uploadFile);
router.get("/my/list", listUserFiles);
router.get("/search", searchFiles);
router.get("/:id/metadata", getFileMetadata);
router.get("/:id", downloadFile);
router.delete("/:id", deleteFile);

export default router;
