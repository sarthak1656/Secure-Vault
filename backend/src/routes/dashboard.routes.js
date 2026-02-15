import express from "express";
import { getDashboardStats } from "../controllers/dashboard.controller.js";
import { authenticateJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

// Get dashboard statistics and data
router.get("/stats", authenticateJWT, getDashboardStats);

export default router;
