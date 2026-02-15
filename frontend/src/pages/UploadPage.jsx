import React, { useState, useCallback } from 'react';
import { Filter, Lock, CheckCircle, AlertCircle, FileText, X, CloudUpload, Loader2 } from 'lucide-react';

// Components
import DashboardLayout from '../components/layout/DashboardLayout';
import Header from '../components/layout/Header';
import FileUploader from '../components/files/FileUploader';
import ProgressBar from '../components/common/ProgressBar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

// API & Context
import { fileAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

const UploadPage = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  
  // FIXED: Renamed 'success' and 'error' from the context to avoid conflicts
  const { success: showSuccess, error: showError } = useToast();

  // Handle files dropped or selected
  const handleFileSelect = useCallback((selectedFiles) => {
    // Ensure selectedFiles is an array
    const newFiles = Array.from(selectedFiles);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  }, []);

  // Remove file from queue
  const removeFile = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  // Perform the actual upload
  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setUploadProgress({});

    try {
      // Upload files in parallel
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('filename', file.name); // Ensure filename is passed to backend

        // Uses the uploadFile function from your api.js
        return fileAPI.uploadFile(formData, (progress) => {
          setUploadProgress((prev) => ({
            ...prev,
            [file.name]: progress,
          }));
        });
      });

      await Promise.all(uploadPromises);

      showSuccess(`Successfully uploaded ${files.length} file(s)!`);
      setFiles([]); // Clear queue on success
      setUploadProgress({});
    } catch (error) {
      console.error("Upload error:", error);
      showError(error.message || 'Failed to upload some files');
    } finally {
      setUploading(false);
    }
  };

  // Utility to format sizes beautifully
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  
  // 50 MB limit to prevent backend OOM (Out of Memory) crashes
  const maxFileSize = 50 * 1024 * 1024; 
  
  const canUpload = files.length > 0 && totalSize <= maxFileSize && !uploading;

  return (
    <DashboardLayout>
      <Header title="Upload Files" showSearch={false} />

      <p className="text-slate-500 -mt-6 mb-8">Upload and encrypt your files securely</p>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* --- LEFT COLUMN (2/3 width) --- */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Real Drag & Drop Zone */}
          <FileUploader 
            onFileSelect={handleFileSelect} 
            disabled={uploading}
          />

          {/* Limits Banner */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-center gap-3 text-amber-800 text-sm">
            <Filter className="w-5 h-5 shrink-0" /> 
            <span><strong>File Upload Limits:</strong> Maximum file size: 50 MB (Encrypted in Memory)</span>
          </div>

          {/* Real Queued Files List */}
          {files.length > 0 && (
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Queued Files ({files.length})</h4>
              <div className="bg-white border border-slate-100 rounded-2xl p-2 shadow-sm space-y-1">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition border border-transparent hover:border-slate-100">
                    <FileText className="w-8 h-8 text-slate-400" />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-bold text-slate-800 truncate pr-4">{file.name}</span>
                        {!uploading && (
                          <button 
                            onClick={() => removeFile(index)}
                            className="text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
                        <span>{formatFileSize(file.size)}</span>
                        {uploadProgress[file.name] !== undefined && (
                          <span className="font-medium text-violet-600">
                            {Math.round(uploadProgress[file.name])}%
                          </span>
                        )}
                      </div>

                      {/* Progress Bar */}
                      {(uploadProgress[file.name] !== undefined || uploading) && (
                         <ProgressBar 
                           progress={uploadProgress[file.name] || 0} 
                           color="bg-violet-500" 
                           className="h-1.5" 
                         />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* --- RIGHT COLUMN (1/3 width) --- */}
        <div className="space-y-6">
          
          {/* Destination Card */}
          <Card>
            <h4 className="font-bold text-slate-900 mb-4">Select Destination</h4>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Folder</label>
                <select 
                  className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                  disabled={uploading}
                >
                  <option value="root">Root</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Encryption Info Card */}
          <Card>
            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4 text-violet-600" /> Encryption
            </h4>
            <ul className="space-y-3 text-sm text-slate-600 mb-6">
              <li className="flex gap-2 items-center"><CheckCircle className="w-4 h-4 text-emerald-500" /> <span className="font-semibold text-slate-800">AES-256</span> encryption enabled</li>
              <li className="flex gap-2 items-center"><CheckCircle className="w-4 h-4 text-emerald-500" /> <span className="font-semibold text-slate-800">SSL/TLS</span> in transit protection</li>
              <li className="flex gap-2 items-center"><CheckCircle className="w-4 h-4 text-emerald-500" /> <span className="font-semibold text-slate-800">Zero-knowledge</span> architecture</li>
            </ul>
            <div className="bg-sky-50 p-3 rounded-lg text-xs text-sky-700 flex gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> Files are encrypted before being sent to our servers.
            </div>
          </Card>

          {/* Upload Summary */}
          <Card>
            <h4 className="font-bold text-slate-900 mb-4">Upload Summary</h4>
            <div className="space-y-2 text-sm mb-6">
              <div className="flex justify-between text-slate-500">
                <span>Files ready:</span>
                <span className="font-bold text-slate-900">{files.length}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Total size:</span>
                <span className={`font-bold ${totalSize > maxFileSize ? 'text-red-500' : 'text-slate-900'}`}>
                  {formatFileSize(totalSize)}
                </span>
              </div>
            </div>
            
            <Button 
              variant="primary" 
              className="w-full" 
              icon={uploading ? Loader2 : CloudUpload}
              onClick={handleUpload}
              disabled={!canUpload}
            >
              {uploading ? 'UPLOADING...' : 'UPLOAD ALL'}
            </Button>
            
            {totalSize > maxFileSize && (
              <p className="text-xs text-red-500 mt-2 text-center">Total file size exceeds 50 MB limit.</p>
            )}
          </Card>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default UploadPage;