import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  ArrowRight,
  Check,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Loader from "../components/common/Loader";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const { error: showError } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Validation States
  const [emailError, setEmailError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState("");

  // Email Validation Logic
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("");
    } else if (!regex.test(email)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  // Password Strength Logic
  const checkPasswordStrength = (pass) => {
    let score = 0;
    if (!pass) return 0;

    if (pass.length > 7) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[!@#$%^&*]/.test(pass)) score++;
    if (/[A-Z]/.test(pass)) score++;

    return score;
  };

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "email") {
      validateEmail(value);
    }
    if (name === "password") {
      const score = checkPasswordStrength(value);
      setPasswordStrength(score);

      if (score < 2) setPasswordFeedback("Weak");
      else if (score === 2 || score === 3) setPasswordFeedback("Medium");
      else setPasswordFeedback("Strong");
    }
  };

  // Get color based on strength score
  const getStrengthColor = () => {
    if (passwordStrength === 0) return "bg-slate-200";
    if (passwordStrength < 2) return "bg-red-500";
    if (passwordStrength < 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final Validation Check
    if (emailError || passwordStrength < 2) {
      showError("Please fix errors before submitting.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      showError("Passwords do not match!");
      return;
    }

    try {
      await register(formData.name, formData.email, formData.password, formData.confirmPassword);
      // Redirect to Verify Email Page
      navigate("/verify-email", { state: { email: formData.email } });
    } catch (err) {
      showError(err.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-800">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-600 p-3 rounded-xl shadow-lg shadow-blue-900/50">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Create Account
            </h2>
            <p className="text-slate-400">Join Secure Vault today</p>
          </div>
        </div>

        {/* Form Container */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:bg-slate-100"
                  placeholder="John Doe"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email Field with Validation */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 outline-none transition disabled:bg-slate-100 ${
                    emailError
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                  placeholder="you@example.com"
                  required
                  disabled={isLoading}
                />
                {/* Visual Checkmark/X */}
                {formData.email && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    {emailError ? (
                      <X className="h-5 w-5 text-red-500" />
                    ) : (
                      <Check className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                )}
              </div>
              {emailError && (
                <p className="mt-1 text-xs text-red-500">{emailError}</p>
              )}
            </div>

            {/* Password Field with Strength Meter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:bg-slate-100"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none disabled:opacity-50"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Strength Meter Bars */}
              {formData.password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1 h-1.5">
                    <div
                      className={`flex-1 rounded-full transition-all duration-300 ${passwordStrength >= 1 ? getStrengthColor() : "bg-slate-200"}`}
                    ></div>
                    <div
                      className={`flex-1 rounded-full transition-all duration-300 ${passwordStrength >= 2 ? getStrengthColor() : "bg-slate-200"}`}
                    ></div>
                    <div
                      className={`flex-1 rounded-full transition-all duration-300 ${passwordStrength >= 3 ? getStrengthColor() : "bg-slate-200"}`}
                    ></div>
                    <div
                      className={`flex-1 rounded-full transition-all duration-300 ${passwordStrength >= 4 ? getStrengthColor() : "bg-slate-200"}`}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>
                      Strength:{" "}
                      <span
                        className={`font-medium ${
                          passwordStrength < 2
                            ? "text-red-500"
                            : passwordStrength < 4
                              ? "text-yellow-600"
                              : "text-green-600"
                        }`}
                      >
                        {passwordFeedback || "Too Short"}
                      </span>
                    </span>
                    {passwordStrength < 4 && (
                      <span className="hidden sm:inline">
                        Add symbols & numbers
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Confirm Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition" />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 outline-none transition disabled:bg-slate-100 ${
                    formData.confirmPassword &&
                    formData.password !== formData.confirmPassword
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </div>
              {formData.confirmPassword &&
                formData.password !== formData.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">
                    Passwords do not match
                  </p>
                )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                !!emailError ||
                passwordStrength < 1 ||
                formData.password !== formData.confirmPassword ||
                isLoading
              }
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none mt-6"
            >
              {isLoading ? (
                <>
                  <Loader size="sm" variant="white" /> Creating Account...
                </>
              ) : (
                <>
                  Create Account <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
