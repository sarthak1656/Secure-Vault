import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import fileRoutes from "./routes/file.routes.js";
import shareRoutes from "./routes/share.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

// Security middleware
app.use(helmet());

// Support multiple origins and allow non-browser requests (e.g., Postman)
const rawClientUrls = process.env.CLIENT_URL || "http://localhost:5173";
const allowedOrigins = rawClientUrls.split(",").map((u) => u.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
    // ✨ BULLETPROOF FIX: Tell the browser to let React read the filename and file type!
    exposedHeaders: ["Content-Disposition", "Content-Type"],
  }),
);

// Parsing middleware
app.use(express.json({ limit: "10kb" })); 
app.use(express.urlencoded({ limit: "10kb", extended: true }));
app.use(cookieParser());

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running" });
});

// =========================================================================
// ROUTES CONFIGURATION
// =========================================================================

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);

// CRITICAL FIX: Mount shareRoutes BEFORE fileRoutes.
// Why? shareRoutes contains public endpoints (like /api/files/share/:token)
// fileRoutes applies a global authentication check to everything under /api/files.
// If you swap these, public users cannot access shared files without logging in.
app.use("/api/files", shareRoutes); 
app.use("/api/files", fileRoutes);

app.use("/api/user", userRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Duplicate field value entered",
    });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expired",
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server error",
  });
});

export default app;