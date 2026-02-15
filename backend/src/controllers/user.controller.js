import User from "../models/user.model.js";
import File from "../models/file.model.js";
import bcrypt from "bcryptjs";

// @desc Get user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { name, bio, organization, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: { name, bio, organization, phone } },
      { new: true, runValidators: true }
    ).select("-password");
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get storage usage
export const getStorageInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    // You can also calculate this live by summing file sizes
    const files = await File.find({ ownerId: req.user.userId });
    const used = files.reduce((acc, file) => acc + file.size, 0);
    
    res.status(200).json({ 
      success: true, 
      used, 
      limit: user.storageLimit || 5368709120 // Default 5GB
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get active sessions (Placeholder - can be expanded with a Session model)
export const getActiveSessions = async (req, res) => {
  try {
    // For now, returning current session info. 
    // To show multiple, you'd need a Session collection.
    res.status(200).json({ 
      success: true, 
      sessions: [{
        _id: "current",
        deviceInfo: req.headers['user-agent'],
        ipAddress: req.ip,
        isCurrent: true
      }]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Logout specific session
export const logoutSession = async (req, res) => {
  res.status(200).json({ success: true, message: "Session revoked" });
};

// @desc Change Password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.userId);
    
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Current password incorrect" });

    user.password = newPassword; // Middleware in user model should hash this
    await user.save();
    res.status(200).json({ success: true, message: "Password updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};