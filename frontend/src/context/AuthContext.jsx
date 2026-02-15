import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // Default to TRUE to prevent flashing "User" before data loads
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          const response = await authAPI.getCurrentUser();
          
          // api.js intercepts Axios and returns response.data directly
          const userData = response.user || response;
          
          if (userData && Object.keys(userData).length > 0) {
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            throw new Error("No user data found");
          }
        }
      } catch (err) {
        console.error("Auth check failed:", err.message);
        localStorage.removeItem("authToken");
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        // Stop loading once check is complete, regardless of success/fail
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authAPI.login(email, password);
      
      const userData = response.user || response;
      const token = response.token;

      if (token) localStorage.setItem("authToken", token);
      
      setUser(userData);
      setIsAuthenticated(true);
      return response;
    } catch (err) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password, confirmPassword) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authAPI.register(name, email, password, confirmPassword);
      return response;
    } catch (err) {
      setError(err.message || "Registration failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (email, otp) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authAPI.verifyEmail(email, otp);
      
      const userData = response.user || response;
      const token = response.token;
      
      setUser(userData);
      
      if (token) {
        localStorage.setItem("authToken", token);
        setIsAuthenticated(true);
      }
      return response;
    } catch (err) {
      setError(err.message || "Verification failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authAPI.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("authToken");
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authAPI.forgotPassword(email);
      return response;
    } catch (err) {
      setError(err.message || "Failed to send reset email");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token, newPassword) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authAPI.resetPassword(token, newPassword);
      return response;
    } catch (err) {
      setError(err.message || "Password reset failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading, // Critical: exposed to Header and PrivateRoutes
    error,
    isAuthenticated,
    login,
    register,
    verifyEmail,
    logout,
    forgotPassword,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};