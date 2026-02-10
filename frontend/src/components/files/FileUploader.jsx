import React, { useState } from 'react';
import { CloudUpload } from 'lucide-react';
import Button from '../common/Button';

const FileUploader = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    // In a real app, you'd access e.dataTransfer.files
    console.log("Files dropped");
    if (onFileSelect) onFileSelect();
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-200 cursor-pointer group
        ${isDragging 
          ? 'border-blue-500 bg-blue-50 scale-[1.01]' 
          : 'border-indigo-200 bg-indigo-50/30 hover:bg-indigo-50/50 hover:border-indigo-400'
        }
      `}
    >
      <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition duration-300">
        <CloudUpload className="w-8 h-8 text-violet-600" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">Drag & Drop Your Files</h3>
      <p className="text-slate-500 mb-8">or click below to select files from your computer</p>
      
      <div className="flex justify-center">
        <Button variant="primary" onClick={onFileSelect}>
          BROWSE FILES
        </Button>
      </div>
    </div>
  );
};

export default FileUploader;