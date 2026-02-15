import React, { useState, useEffect } from 'react';
import { Share2, Clock, Trash2, Copy, ExternalLink, Check, AlertCircle } from 'lucide-react';

import DashboardLayout from '../components/layout/DashboardLayout';
import Header from '../components/layout/Header';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
// EXACTLY matching your api.js export
import { sharingAPI } from '../services/api'; 
import { useToast } from '../context/ToastContext';
import FileIcon from '../components/files/FileIcon';

const SharedFiles = () => {
  const [shares, setShares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchShares();
  }, []);

  const fetchShares = async () => {
    try {
      setLoading(true);
      const response = await sharingAPI.getSharedFiles();
      setShares(response.data?.shares || response.shares || []);
    } catch (err) {
      console.error(err);
      showError('Failed to load shared files');
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (shareId) => {
    if (!window.confirm("Are you sure you want to delete this share link? The file will no longer be accessible via this link.")) {
      return;
    }

    try {
      // Matching the exact name in your api.js
      await sharingAPI.revokeSharing(shareId);
      setShares(prev => prev.filter(s => s.id !== shareId && s._id !== shareId));
      showSuccess('Link revoked successfully');
    } catch (err) {
      showError('Failed to revoke link');
    }
  };

  const copyLink = (token, id) => {
    const link = `${window.location.origin}/share/${token}`;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    showSuccess('Link copied!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  const isExpired = (dateString) => {
    return new Date(dateString) < new Date();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Header title="Shared Links" showSearch={false} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Header title="Shared Links" showSearch={false} />
      
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Active Share Links</h2>
        <p className="text-slate-500">Manage the secure links you have created for your files.</p>
      </div>

      {shares.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 mb-8">
          {shares.map((share) => (
            <div 
              key={share.id || share._id}
              className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              {/* File Info */}
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center shrink-0">
                  <FileIcon className="w-6 h-6" type={share.filename?.split('.').pop()} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{share.filename || share.originalName}</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span>{formatFileSize(share.fileSize)}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> 
                      Expires: <span className={isExpired(share.expiresAt) ? "text-red-500 font-bold" : ""}>
                        {formatDate(share.expiresAt)}
                      </span>
                    </span>
                    <span>•</span>
                    <span>Views: {share.accessCount || 0}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 w-full sm:w-auto border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
                <button 
                  onClick={() => copyLink(share.token, share.id || share._id)}
                  className="flex-1 sm:flex-none py-2 px-4 text-xs font-bold bg-violet-50 text-violet-700 rounded-lg hover:bg-violet-100 transition flex items-center justify-center gap-2"
                >
                  {copiedId === (share.id || share._id) ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedId === (share.id || share._id) ? "Copied" : "Copy Link"}
                </button>
                
                <a 
                  href={`/share/${share.token}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                  title="Test Link"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>

                <button 
                  onClick={() => handleRevoke(share.id || share._id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Revoke Link"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState 
          message="No active shared links" 
          actionLabel="Share a file from My Files"
          onAction={() => window.location.href = '/my-files'}
        />
      )}

      {/* Info Alert */}
      {shares.length > 0 && (
        <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 flex items-start gap-3 text-sky-800">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm">
            <strong>Tip:</strong> Revoking a link immediately blocks access to the file. Anyone who clicks a revoked link will see an error.
          </p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default SharedFiles;