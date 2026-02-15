import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// --- Auth Components ---
import PrivateRoute from "./components/auth/PrivateRoute";

// --- Public Pages ---
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import FileSharePage from "./pages/FileSharePage"; // NEW PUBLIC PAGE

// --- Private Pages ---
import Dashboard from "./pages/Dashboard";
import MyFiles from "./pages/MyFiles";
import SharedFiles from "./pages/SharedFiles";
import UploadPage from "./pages/UploadPage"; // Assuming you renamed UploadPageNew to UploadPage
import SettingsPage from "./pages/SettingsPage";

// --- Toast Container ---
import { ToastContainer } from "./components/common/Toast";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* ==============================
              Public Routes (Accessible by everyone)
             ============================== */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          
          {/* NEW ROUTE: For public link sharing */}
          <Route path="/share/:token" element={<FileSharePage />} />

          {/* ==============================
              Private Routes (Protected)
             ============================== */}
          {/* All routes inside this wrapper check for 'authToken' */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/my-files" element={<MyFiles />} />
            <Route path="/shared" element={<SharedFiles />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* ==============================
              404 Page
             ============================== */}
          <Route
            path="*"
            element={
              <div className="p-10 text-center text-slate-500">
                404 - Page Not Found
              </div>
            }
          />
        </Routes>
      </Router>

      {/* Toast Container - Displays all toasts */}
      <ToastContainer />
    </>
  );
}

export default App;