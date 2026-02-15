import { verifyToken } from "../config/jwt.js";

/**
 * Middleware to authenticate JWT token
 * Extracts token from cookies or Authorization header
 */
const authenticateJWT = (req, res, next) => {
  try {
    let token;

    // Option 1: Get token from Authorization header
    if (req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.slice(7); // Remove "Bearer " prefix
      }
    }

    // Option 2: Get token from cookies (HttpOnly)
    if (!token && req.cookies) {
      token = req.cookies.authToken;
    }

    // If no token found, return 401
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No authentication token provided",
      });
    }

    // Verify token
    const decoded = verifyToken(token);

    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error: error.message,
    });
  }
};

export { authenticateJWT };
