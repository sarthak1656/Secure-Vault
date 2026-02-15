import React, { useState, useEffect } from "react";
import {
  LayoutGrid,
  List,
  UploadCloud,
  Plus,
  Folder,
  Home,
  ChevronRight,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Shared Components
import DashboardLayout from "../components/layout/DashboardLayout";
import Header from "../components/layout/Header";
import Modal from "../components/common/Modal";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import FileRow from "../components/files/FileRow";
import FileCard from "../components/files/FileCard";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import ConfirmDialog from "../components/common/ConfirmDialog"; //

// API Services
import { fileAPI, sharingAPI } from "../services/api";
import { useToast } from "../context/ToastContext";

const MyFiles = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // --- Share Modal State ---
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [shareLink, setShareLink] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);

  // --- DELETE CONFIRMATION STATE ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); //
  const [fileToDelete, setFileToDelete] = useState(null); //

  const { success: showSuccess, error: showError } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await fileAPI.getFiles();
      setFiles(Array.isArray(response) ? response : response.files || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load files");
      showError("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (file) => {
    try {
      const fileId = file._id || file.id;
      const fileName = file.originalName || file.filename || "download";
      await fileAPI.downloadFile(fileId, fileName);
      showSuccess(`Download started for "${fileName}"`);
    } catch (err) {
      console.error(err);
      showError("Failed to download file");
    }
  };

  // Triggered when user clicks the Trash icon
  const handleDeleteClick = (file) => {
    setFileToDelete(file); //
    setIsDeleteModalOpen(true); //
  };

  // Triggered only after user confirms in the Modal
  const handleConfirmDelete = async () => {
    if (!fileToDelete) return; //

    try {
      const fileId = fileToDelete._id || fileToDelete.id; //
      await fileAPI.deleteFile(fileId); //
      setFiles((prev) => prev.filter((f) => (f._id || f.id) !== fileId)); //
      showSuccess("File deleted successfully"); //
    } catch (err) {
      console.error(err);
      showError("Failed to delete file");
    } finally {
      setIsDeleteModalOpen(false); //
      setFileToDelete(null); //
    }
  };

  const handleShareClick = (file) => {
    setSelectedFile(file);
    setShareLink("");
    setIsShareModalOpen(true);
    setIsCopied(false);
    generateLink(file);
  };

  const generateLink = async (file) => {
    try {
      setIsGeneratingLink(true);
      const fileId = file._id || file.id;
      const response = await sharingAPI.createSharingLink(fileId);
      const token = response.share?.token || response.token;
      if (!token) throw new Error("No token received");
      const url = `${window.location.origin}/share/${token}`;
      setShareLink(url);
    } catch (err) {
      console.error(err);
      showError("Failed to generate share link");
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const copyToClipboard = () => {
    if (!shareLink) return;
    navigator.clipboard.writeText(shareLink);
    setIsCopied(true);
    showSuccess("Link copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredFiles = files.filter((file) => {
    const name = file.originalName || file.filename || "";
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return (
      <DashboardLayout>
        <Header title="My Files" showSearch={false} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <Header title="My Files" showSearch={false} />
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchFiles}>Try Again</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Header
        title="My Files"
        showSearch={true}
        searchValue={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">My Files</h2>
          <p className="text-slate-500">Manage and organize your encrypted files</p>
        </div>

        <div className="flex gap-3">
          <div className="bg-white border border-slate-200 rounded-lg p-1 flex items-center h-fit">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition ${viewMode === "grid" ? "bg-violet-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50"}`}
              title="Grid View"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition ${viewMode === "list" ? "bg-violet-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50"}`}
              title="List View"
            >
              <List size={18} />
            </button>
          </div>
          <Button
            variant="primary"
            icon={UploadCloud}
            onClick={() => navigate("/upload")}
          >
            Upload Files
          </Button>
        </div>
      </div>

      <div className="mb-10">
        {filteredFiles.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredFiles.map((file) => (
                <FileCard
                  key={file._id || file.id}
                  name={file.originalName || file.filename || ""}
                  size={formatFileSize(file.size)}
                  date={formatDate(file.uploadedAt || file.createdAt)}
                  type={file.mimeType || ""}
                  onShare={() => handleShareClick(file)}
                  onDownload={() => handleDownload(file)}
                  onDelete={() => handleDeleteClick(file)} //
                />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              {filteredFiles.map((file) => (
                <FileRow
                  key={file._id || file.id}
                  name={file.originalName || file.filename || ""}
                  size={formatFileSize(file.size)}
                  date={formatDate(file.uploadedAt || file.createdAt)}
                  type={file.mimeType || ""}
                  onShare={() => handleShareClick(file)}
                  onDownload={() => handleDownload(file)}
                  onDelete={() => handleDeleteClick(file)} //
                />
              ))}
            </div>
          )
        ) : (
          <EmptyState
            message={searchQuery ? "No files found matching your search" : "No files uploaded yet"}
            actionLabel={!searchQuery && "Upload your first file"}
            onAction={() => navigate("/upload")}
          />
        )}
      </div>

      {/* --- SHARE MODAL --- */}
      <Modal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Share File"
      >
        <div className="space-y-6">
          <p className="text-sm text-slate-600">
            Anyone with this link can view and download{" "}
            <strong className="text-slate-900">
              {selectedFile?.originalName || selectedFile?.filename}
            </strong>. The link expires in 7 days.
          </p>
          <div className="relative">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Share Link</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={isGeneratingLink ? "Generating link..." : shareLink}
                className="w-full bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-lg py-3 px-4 focus:outline-none"
              />
              <Button variant="primary" onClick={copyToClipboard} disabled={isGeneratingLink || !shareLink}>
                {isCopied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button variant="ghost" onClick={() => setIsShareModalOpen(false)}>Close</Button>
          </div>
        </div>
      </Modal>

      {/* --- ASKING MODAL (DELETE CONFIRMATION) --- */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen} //
        title="Delete File" //
        message={`Are you sure you want to delete "${fileToDelete?.originalName || fileToDelete?.filename}"? This action cannot be undone.`} //
        onConfirm={handleConfirmDelete} //
        onCancel={() => setIsDeleteModalOpen(false)} //
        isDangerous={true} //
      />
    </DashboardLayout>
  );
};

export default MyFiles;