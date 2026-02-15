import express from "express";
import {
  register,
  login,
  getCurrentUser,
  logout,
  sendOtp,
  verifyEmail,
} from "../controllers/auth.controller.js";
import { authenticateJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/send-otp", sendOtp);
router.post("/verify-email", verifyEmail);

// Protected routes
router.get("/me", authenticateJWT, getCurrentUser);
router.post("/logout", authenticateJWT, logout);

export default router;
