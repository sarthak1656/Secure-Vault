import User from "../models/user.model.js";
import { generateToken } from "../config/jwt.js";
import { sendEmail } from "../utils/email.js";
import crypto from "crypto"; 

/**
 * @desc Register a new user
 * @route POST /auth/register
 */
const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validate input
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Generate a 6-digit numeric OTP SECURELY
    // range: 100,000 to 1,000,000 (exclusive) -> 100,000 to 999,999
    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create new user
    const user = await User.create({
      name,
      email,
      password, // Will be hashed by model pre-save hook
      emailOTP: otp,
      emailOTPExpires: otpExpiry,
    });

    // Send OTP email
    try {
      await sendEmail({
        to: user.email,
        subject: "Your verification code",
        text: `Your verification code is ${otp}. It expires in 10 minutes.`,
        html: `<p>Your verification code is <strong>${otp}</strong>. It expires in 10 minutes.</p>`,
      });
    } catch (err) {
      console.error("Failed to send OTP email:", err);
    }

    // Generate JWT token
    const token = generateToken(user._id, user.email, user.role);

    // Set HttpOnly cookie
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully. OTP sent to email.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

/**
 * @desc Send/resend OTP to email
 * @route POST /auth/send-otp
 */
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email }).select("+emailOTP +emailOTPExpires");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Generate OTP SECURELY
    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.emailOTP = otp;
    user.emailOTPExpires = otpExpiry;
    await user.save();

    try {
      await sendEmail({
        to: user.email,
        subject: "Your verification code",
        text: `Your verification code is ${otp}. It expires in 10 minutes.`,
        html: `<p>Your verification code is <strong>${otp}</strong>. It expires in 10 minutes.</p>`,
      });
    } catch (err) {
      console.error("Failed to send OTP email:", err);
    }

    return res.status(200).json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.error("sendOtp error:", error);
    return res.status(500).json({ success: false, message: "Failed to send OTP", error: error.message });
  }
};

/**
 * @desc Verify email OTP
 * @route POST /auth/verify-email
 */
const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email }).select("+emailOTP +emailOTPExpires +isVerified");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.emailOTP || !user.emailOTPExpires) {
      return res.status(400).json({ success: false, message: "No OTP found. Please request a new one." });
    }

    if (user.emailOTP !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (new Date() > user.emailOTPExpires) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    // Mark verified and clear OTP
    user.isVerified = true;
    user.emailOTP = undefined;
    user.emailOTPExpires = undefined;
    await user.save();

    return res.status(200).json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.error("verifyEmail error:", error);
    return res.status(500).json({ success: false, message: "Verification failed", error: error.message });
  }
};

/**
 * @desc Login user
 * @route POST /auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find user and include password field
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const isPasswordCorrect = await user.matchPassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is inactive",
      });
    }

    // Generate JWT token
    const token = generateToken(user._id, user.email, user.role);

    // Set HttpOnly cookie
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

/**
 * @desc Get current user profile
 * @route GET /auth/me
 */
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        storageUsed: user.storageUsed,
        storageLimit: user.storageLimit,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
      error: error.message,
    });
  }
};

/**
 * @desc Logout user (client-side)
 * @route POST /auth/logout
 */
const logout = async (req, res) => {
  try {
    // Clear authentication cookie
    res.clearCookie("authToken");

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error.message,
    });
  }
};

export { register, login, getCurrentUser, logout, sendOtp, verifyEmail };