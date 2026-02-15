import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Download,
  FileText,
  AlertTriangle,
  Clock,
  ShieldCheck,
} from "lucide-react";
import Loader from "../components/common/Loader";
import Button from "../components/common/Button";
import FileIcon from "../components/files/FileIcon";

// Matches your api.js base URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const FileSharePage = () => {
  const { token } = useParams();
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchMetadata();
  }, [token]);

  // Fetch file details (Name, Size, Expiry) publicly
  const fetchMetadata = async () => {
    try {
      setLoading(true);
      // ✨ FIXED: shareRoutes are mounted at /api/files, so full path is /api/files/share/:token/metadata
      const response = await fetch(`${API_URL}/files/share/${token}/metadata`);

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 410)
          throw new Error("This share link has expired.");
        if (response.status === 404)
          throw new Error("File not found or link is invalid.");
        throw new Error(data.message || "Failed to load file details.");
      }

      setFileData(data.file);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Download the actual decrypted file
  const handleDownload = async () => {
    try {
      setDownloading(true);

      // ✨ FIXED: Updated path to match shareRoutes mount at /api/files
      const response = await fetch(`${API_URL}/files/share/${token}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Download failed");
      }

      const contentType =
        response.headers.get("Content-Type") || "application/octet-stream";
      const rawBlob = await response.blob();
      const blob = new Blob([rawBlob], { type: contentType });
      const url = window.URL.createObjectURL(blob);

      let finalFilename =
        fileData?.originalName || fileData?.filename || "download";

      // Successfully read Content-Disposition because of CORS exposedHeaders in app.js
      const contentDisposition = response.headers.get("Content-Disposition");
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) finalFilename = match[1];
      }

      const a = document.createElement("a");
      a.href = url;
      a.download = finalFilename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Share Download Error:", err);
      alert(`Download failed: ${err.message}`);
    } finally {
      setDownloading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <Loader size="lg" />
      </div>
    );

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-sm text-center">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Link Invalid
          </h2>
          <p className="text-slate-500 mb-6">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative">
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-violet-600 to-slate-50 -z-10"></div>

      <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-slate-50 p-6 border-b border-slate-100 text-center">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">
            Secure File Share
          </p>
          <h1 className="text-xl font-bold text-slate-800">
            Someone shared a file with you
          </h1>
        </div>

        <div className="p-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <FileIcon
                type={fileData?.mimeType?.split("/")[1]}
                className="w-12 h-12"
              />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-2 break-all">
              {fileData?.originalName || fileData?.filename}
            </h2>

            <div className="flex items-center gap-4 text-sm text-slate-500 mb-8">
              <span className="flex items-center gap-1">
                <FileText className="w-4 h-4" />{" "}
                {formatFileSize(fileData?.size || 0)}
              </span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> Expires:{" "}
                {new Date(fileData?.expiresAt).toLocaleDateString()}
              </span>
            </div>

            <Button
              size="lg"
              className="w-full justify-center py-4 text-lg shadow-lg shadow-violet-200"
              icon={Download}
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading ? "Decrypting & Downloading..." : "Download File"}
            </Button>

            <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>End-to-End Encrypted Transfer</span>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-8 text-white/80 text-sm font-medium">
        Powered by Secure Vault
      </p>
    </div>
  );
};

export default FileSharePage;
