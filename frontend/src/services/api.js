import axios from 'axios';

// API Service Layer - Centralized API calls
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Helper function to get auth token
const getAuthToken = () => localStorage.getItem("authToken");

// ============================================
// AXIOS GLOBAL CONFIGURATION
// ============================================

// Create a centralized Axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for secure cookies if used
});

// Interceptor: Automatically attach the token to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: Automatically handle responses and global errors (like 401 Unauthorized)
api.interceptors.response.use(
  (response) => {
    // Return just the data object to keep components clean
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - logout user
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }

    // Format the error nicely so your UI components can easily read `.message`
    const formattedError = new Error(
      error.response?.data?.message || error.message || "An error occurred"
    );
    formattedError.status = error.response?.status;
    formattedError.data = error.response?.data;

    return Promise.reject(formattedError);
  }
);

// ============================================
// AUTH APIs
// ============================================

export const authAPI = {
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    if (response.token) {
      localStorage.setItem("authToken", response.token);
    }
    return response;
  },

  register: async (name, email, password, confirmPassword) => {
    return await api.post("/auth/register", { name, email, password, confirmPassword });
  },

  verifyEmail: async (email, otp) => {
    return await api.post("/auth/verify-email", { email, otp });
  },

  sendOtp: async (email) => {
    return await api.post("/auth/send-otp", { email });
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    }
    localStorage.removeItem("authToken");
  },

  getCurrentUser: async () => {
    return await api.get("/auth/me");
  },

  forgotPassword: async (email) => {
    return await api.post("/auth/forgot-password", { email });
  },

  resetPassword: async (token, newPassword) => {
    return await api.post("/auth/reset-password", { token, newPassword });
  },
};

// ============================================
// FILE APIs
// ============================================

export const fileAPI = {
  getFiles: async (folderId = null) => {
    const params = new URLSearchParams();
    if (folderId) params.append("folderId", folderId);
    return await api.get(`/files/my/list?${params.toString()}`);
  },

  getFile: async (fileId) => {
    return await api.get(`/files/${fileId}`);
  },

  // ✨ Modern Axios Upload with built-in progress tracking
  uploadFile: async (formData, onProgress) => {
    return await api.post("/files/upload", formData, {
      // FIXED: Removed the manual Content-Type header so Axios generates the boundary automatically
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          onProgress(progress);
        }
      },
    });
  },

// ✨ Modern Axios Download
  downloadFile: async (fileId, fallbackName = "download") => {
    const token = getAuthToken();
    
    // Using /api/files/ for authenticated downloads
    const response = await axios.get(`${API_URL}/files/${fileId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      withCredentials: true,
      responseType: 'blob', 
    });

    const mimeType = response.headers["content-type"] || "application/octet-stream";
    const blob = new Blob([response.data], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = fallbackName; 
    
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  deleteFile: async (fileId) => {
    return await api.delete(`/files/${fileId}`);
  },

  renameFile: async (fileId, newName) => {
    return await api.patch(`/files/${fileId}`, { name: newName });
  },

  createFolder: async (name, parentFolderId = null) => {
    return await api.post("/folders", { name, parentFolderId });
  },

  deleteFolder: async (folderId) => {
    return await api.delete(`/folders/${folderId}`);
  },

  getRecentFiles: async (limit = 10) => {
    return await api.get(`/files/recent?limit=${limit}`);
  },

  searchFiles: async (query) => {
    return await api.get(`/files/search?q=${encodeURIComponent(query)}`);
  },
};

// ============================================
// SHARING APIs
// ============================================

export const sharingAPI = {
  getSharedFiles: async () => {
    return await api.get("/files/user/shares");
  },

  createSharingLink: async (fileId, expiresIn = 7) => {
    return await api.post(`/files/${fileId}/share`, { expiresIn });
  },

  revokeSharing: async (sharingId) => {
    return await api.delete(`/files/share/${sharingId}`);
  },

  // ✨ FIXED: Updated to use the new /api/share prefix
  getSharedFileMetadata: async (token) => {
    return await api.get(`/share/${token}/metadata`);
  },

  // ✨ FIXED: Updated to use the new /api/share prefix and correct blob handling
  accessSharedFile: async (token) => {
    // Fresh axios call to avoid the 'api' instance's JSON interceptors
    const response = await axios.get(`${API_URL}/share/${token}`, {
      responseType: 'blob' 
    });
    
    const blob = new Blob([response.data], { type: response.headers["content-type"] });
    const url = window.URL.createObjectURL(blob);
    let filename = "shared-file";
    
    // Extract filename from exposed headers
    const contentDisposition = response.headers["content-disposition"];
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?([^"]+)"?/);
      if (match && match[1]) filename = match[1];
    }
    
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },
};

// ============================================
// DASHBOARD APIs
// ============================================

export const dashboardAPI = {
  getDashboardData: async () => {
    return await api.get("/dashboard/stats");
  },
};

// ============================================
// USER APIs
// ============================================

export const userAPI = {
  getProfile: async () => {
    return await api.get("/user/profile");
  },

  updateProfile: async (profileData) => {
    return await api.patch("/user/profile", profileData);
  },

  changePassword: async (currentPassword, newPassword) => {
    return await api.post("/user/change-password", { currentPassword, newPassword });
  },

  getStorageInfo: async () => {
    return await api.get("/user/storage");
  },

  getActiveSessions: async () => {
    return await api.get("/user/sessions");
  },

  logoutSession: async (sessionId) => {
    return await api.delete(`/user/sessions/${sessionId}`);
  },

  logoutAllSessions: async () => {
    return await api.delete("/user/sessions");
  },

  enable2FA: async () => {
    return await api.post("/user/2fa/enable");
  },

  disable2FA: async (code) => {
    return await api.post("/user/2fa/disable", { code });
  },

  deleteAccount: async (password) => {
    // In Axios, DELETE request bodies go inside the 'data' property
    return await api.delete("/user/account", { data: { password } }); 
  },
};

export default api;