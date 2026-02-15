/**
 * Middleware to check user role
 * @param {...string} allowedRoles - Roles allowed to access the route
 * @returns {function} Middleware function
 */
const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Ensure user is authenticated
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }

      // Check if user role is in allowed roles
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Insufficient permissions. Access denied.",
          userRole: req.user.role,
          allowedRoles,
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Authorization check failed",
        error: error.message,
      });
    }
  };
};

/**
 * Middleware to check if user owns the resource
 * Assumes :userId or :id is in params and userId is in req.user
 */
const checkOwnership = (req, res, next) => {
  try {
    const resourceOwnerId = req.params.userId || req.body.ownerId;
    const currentUserId = req.user.userId;

    // Admin can access any resource
    if (req.user.role === "admin") {
      return next();
    }

    // User can only access their own resources
    if (resourceOwnerId.toString() !== currentUserId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to access this resource",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Ownership check failed",
      error: error.message,
    });
  }
};

export { authorizeRole, checkOwnership };
