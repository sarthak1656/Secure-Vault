import File from "../models/file.model.js";
import Share from "../models/share.model.js";
import User from "../models/user.model.js";

/**
 * @desc Get dashboard statistics
 * @route GET /dashboard/stats
 */
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get user information
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get file statistics
    const totalFiles = await File.countDocuments({ ownerId: userId });
    
    // Get shared files count (files shared by user)
    const sharedFilesCount = await Share.countDocuments({ 
      ownerId: userId,
      isActive: true 
    });

    // Get recent files (last 5 files)
    const recentFiles = await File.find({ ownerId: userId })
      .select("filename originalName size mimeType uploadedAt")
      .sort("-uploadedAt")
      .limit(5);

    // Get active sharing links count
    const activeLinksCount = await Share.countDocuments({ 
      ownerId: userId,
      isActive: true,
      linkToken: { $exists: true }
    });

    // Calculate storage usage
    const storageUsed = user.storageUsed || 0;
    const storageLimit = user.storageLimit || (5 * 1024 * 1024 * 1024); // 5GB default
    const storageUsedGB = (storageUsed / (1024 * 1024 * 1024)).toFixed(2);
    const storageLimitGB = (storageLimit / (1024 * 1024 * 1024)).toFixed(2);
    const storagePercentage = Math.round((storageUsed / storageLimit) * 100);

    // Get recent activity (last 10 activities)
    const recentActivity = await getRecentActivity(userId);

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        stats: {
          totalFiles,
          sharedFiles: sharedFilesCount,
          storageUsed: storageUsedGB,
          storageLimit: storageLimitGB,
          storagePercentage,
          secureLinks: activeLinksCount,
        },
        recentFiles: recentFiles.map(file => ({
          id: file._id,
          name: file.originalName || file.filename,
          size: formatFileSize(file.size),
          date: formatRelativeTime(file.uploadedAt),
          type: file.mimeType?.split('/')[1] || 'file',
        })),
        recentActivity,
      },
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
      error: error.message,
    });
  }
};

/**
 * Get recent activity for the user
 */
const getRecentActivity = async (userId) => {
  try {
    const activities = [];
    
    // Get recent file uploads
    const recentUploads = await File.find({ ownerId: userId })
      .select("filename uploadedAt")
      .sort("-uploadedAt")
      .limit(3);

    recentUploads.forEach(file => {
      activities.push({
        id: file._id,
        type: 'upload',
        title: 'File Uploaded',
        description: `Uploaded ${file.filename}`,
        time: formatRelativeTime(file.uploadedAt),
        icon: 'upload',
        color: 'blue'
      });
    });

    // Get recent shares
    const recentShares = await Share.find({ ownerId: userId })
      .populate('sharedWithId', 'name email')
      .sort("-createdAt")
      .limit(3);

    recentShares.forEach(share => {
      activities.push({
        id: share._id,
        type: 'share',
        title: 'File Shared',
        description: share.sharedWithId 
          ? `Shared with ${share.sharedWithId.name}`
          : 'Shared via link',
        time: formatRelativeTime(share.createdAt),
        icon: 'share',
        color: 'emerald'
      });
    });

    // Sort by time and return latest 5
    return activities
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 5);
  } catch (error) {
    console.error("Get recent activity error:", error);
    return [];
  }
};

/**
 * Format file size in human readable format
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format relative time
 */
const formatRelativeTime = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  return new Date(date).toLocaleDateString();
};

export { getDashboardStats };
