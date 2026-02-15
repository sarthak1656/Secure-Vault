import express from "express";
import { 
  getProfile, 
  updateProfile, 
  getStorageInfo, 
  getActiveSessions, 
  logoutSession,
  changePassword 
} from "../controllers/user.controller.js";
import { authenticateJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticateJWT); // Protect all routes below

router.get("/profile", getProfile);
router.patch("/profile", updateProfile);
router.get("/storage", getStorageInfo);
router.get("/sessions", getActiveSessions);
router.delete("/sessions/:sessionId", logoutSession);
router.post("/change-password", changePassword);

export default router;