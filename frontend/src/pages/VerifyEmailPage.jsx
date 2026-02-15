import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Shield, Mail, ArrowRight, RefreshCw, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Loader from "../components/common/Loader";

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyEmail, isLoading } = useAuth();
  const { error: showError } = useToast();

  // Get email from previous page state, or redirect if not available
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [error, setError] = useState("");

  // Timer Logic
  useEffect(() => {
    let interval = null;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  const handleResend = async () => {
    setTimer(30);
    setIsTimerActive(true);
    setError("");
    try {
      // Call API to resend OTP
      // await authAPI.sendOtp(email);
      showError("OTP resent to " + email);
    } catch (err) {
      showError("Failed to resend OTP");
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");

    if (otp.length !== 6) {
      setError("Please enter a 6-digit code");
      return;
    }

    try {
      await verifyEmail(email, otp);
      navigate("/login");
    } catch (err) {
      setError(err.message || "Verification failed. Please try again.");
    }
  };

  if (!email) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-800">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="bg-slate-900 p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-xl shadow-lg shadow-blue-900/50">
              <Mail className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Verify Email</h2>
          <p className="text-slate-400">
            We've sent a 6-digit code to <br />
            <span className="text-white font-medium">{email}</span>
          </p>
        </div>

        {/* Body */}
        <div className="p-8">
          <form onSubmit={handleVerify} className="space-y-6">
            {/* OTP Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 text-center">
                Enter Verification Code
              </label>
              <input
                type="text"
                maxLength="6"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/[^0-9]/g, ""));
                  if (error) setError("");
                }}
                className={`block w-full py-4 text-center text-3xl font-bold tracking-[0.5em] border rounded-xl focus:outline-none transition text-slate-800 placeholder-slate-300 ${
                  error
                    ? "border-red-300 focus:ring-2 focus:ring-red-500"
                    : "border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                }`}
                placeholder="000000"
                autoFocus
                disabled={isLoading}
              />
              {error && (
                <p className="mt-2 text-sm text-center text-red-500">{error}</p>
              )}
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={isLoading || otp.length < 6}
              className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition shadow-lg 
                ${
                  isLoading || otp.length < 6
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/30"
                }`}
            >
              {isLoading ? (
                <>
                  <Loader size="sm" variant="white" /> Verifying...
                </>
              ) : (
                <>
                  Verify Email <CheckCircle className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Resend Timer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-600 mb-2">
              Didn't receive the code?
            </p>
            {isTimerActive ? (
              <span className="text-sm font-medium text-slate-400 flex items-center justify-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin" /> Resend in {timer}
                s
              </span>
            ) : (
              <button
                onClick={handleResend}
                className="text-blue-600 font-semibold text-sm hover:underline disabled:opacity-50"
                disabled={isLoading}
              >
                Resend Code
              </button>
            )}
          </div>

          <div className="mt-6 text-center border-t border-slate-100 pt-4">
            <button
              onClick={() => navigate("/register")}
              className="text-xs text-slate-500 hover:text-slate-800 disabled:opacity-50"
              disabled={isLoading}
            >
              ← Back to Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
