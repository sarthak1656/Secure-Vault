import React, { useState, useRef } from 'react';
import { CloudUpload } from 'lucide-react';
import Button from '../common/Button';

const FileUploader = ({ onFileSelect, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  
  // Reference to the hidden HTML file input
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;

    // Capture dropped files and send them to the parent component
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (onFileSelect) onFileSelect(e.dataTransfer.files);
    }
  };

  // Trigger the hidden file input when the button or box is clicked
  const handleContainerClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Capture files selected via the browse dialog
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      if (onFileSelect) onFileSelect(e.target.files);
    }
    // Clear the input value so you can select the exact same file again if needed
    e.target.value = null;
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleContainerClick}
      className={`
        border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-200 cursor-pointer group relative
        ${isDragging 
          ? 'border-violet-500 bg-violet-50 scale-[1.01]' 
          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-violet-400'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
      `}
    >
      {/* --- HIDDEN FILE INPUT --- */}
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileInputChange}
        className="hidden"
        multiple // Allows selecting multiple files at once
        disabled={disabled}
      />

      <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition duration-300 pointer-events-none">
        <CloudUpload className="w-8 h-8 text-violet-600" />
      </div>
      
      <h3 className="text-xl font-bold text-slate-900 mb-2 pointer-events-none">Drag & Drop Your Files</h3>
      <p className="text-slate-500 mb-8 pointer-events-none">or click anywhere to select files from your computer</p>
      
      <div className="flex justify-center pointer-events-none">
        <Button variant="primary" disabled={disabled}>
          BROWSE FILES
        </Button>
      </div>
    </div>
  );
};

export default FileUploader;