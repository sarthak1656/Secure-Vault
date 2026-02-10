import React from 'react';
import { MoreVertical, Image as ImageIcon } from 'lucide-react';
import FileIcon from './FileIcon';

const FileCard = ({ name, size, date, type }) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition cursor-pointer group relative">
      
      {/* Context Menu Button (Top Right) */}
      <button className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition z-10">
        <MoreVertical className="w-4 h-4" />
      </button>

      {/* Preview Area (Gray Box) */}
      <div className="bg-slate-50 rounded-xl h-40 mb-4 flex items-center justify-center overflow-hidden group-hover:bg-slate-100 transition">
        {/* If it's an image, we could show a real thumbnail here. For now, show a large icon. */}
        <FileIcon type={type} className="w-16 h-16 opacity-50" />
      </div>

      {/* File Info Footer */}
      <div className="flex gap-3 items-start">
        {/* Small Icon */}
        <div className="shrink-0">
          <FileIcon type={type} className="w-5 h-5" />
        </div>
        
        {/* Text Details */}
        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-slate-800 text-sm truncate" title={name}>{name}</h4>
          <p className="text-xs text-slate-500 font-medium mt-0.5">{size}</p>
          <p className="text-[10px] text-slate-400 mt-1">{date}</p>
        </div>
      </div>
    </div>
  );
};

export default FileCard;