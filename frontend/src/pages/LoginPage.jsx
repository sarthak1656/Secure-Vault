import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Shield, ArrowRight } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate(); // <--- 2. Initialize the hook

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login data:", formData);

    // --- AUTH LOGIC STARTS HERE ---

    // 1. Simulate API Call (Replace this with real backend call later)
    if (formData.email && formData.password) {
      // 2. Save Token to LocalStorage
      // This is what PrivateRoute checks for!
      localStorage.setItem("authToken", "demo-token-12345");

      // 3. Redirect to Dashboard
      navigate("/dashboard");
    } else {
      alert("Please enter valid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-slate-400">Sign in to access your secure vault</p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2">Remember me</span>
              </label>
              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
            >
              Sign In <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-semibold hover:underline"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
