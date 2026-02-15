import React from 'react';
import { MoreVertical, Share, Download, Trash2 } from 'lucide-react';
import FileIcon from './FileIcon';

const FileCard = ({ name, size, date, type, onShare, onDownload, onDelete }) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition cursor-pointer group relative flex flex-col h-full">
      
      {/* Preview Area */}
      <div className="bg-slate-50 rounded-xl h-32 mb-4 flex items-center justify-center overflow-hidden group-hover:bg-slate-100 transition relative">
        <FileIcon type={type} className="w-12 h-12 opacity-50" />
      </div>

      {/* File Info */}
      <div className="flex gap-3 items-start mb-2 flex-1">
        <div className="shrink-0 pt-0.5">
          <FileIcon type={type} className="w-5 h-5" />
        </div>
        
        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-slate-800 text-sm truncate" title={name}>{name}</h4>
          <p className="text-xs text-slate-500 font-medium mt-0.5">{size}</p>
          <p className="text-[10px] text-slate-400 mt-1">{date}</p>
        </div>
      </div>

      {/* Action Buttons - Always Visible now */}
      <div className="flex gap-1 justify-end border-t border-slate-50 pt-2 mt-auto">
        {onShare && (
          <button 
            onClick={(e) => { e.stopPropagation(); onShare(); }}
            className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
            title="Share file"
          >
            <Share className="w-4 h-4" />
          </button>
        )}
        
        {onDownload && (
          <button 
            onClick={(e) => { e.stopPropagation(); onDownload(); }}
            className="p-2 rounded-lg text-slate-400 hover:text-green-600 hover:bg-green-50 transition"
            title="Download file"
          >
            <Download className="w-4 h-4" />
          </button>
        )}
        
        {onDelete && (
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
            title="Delete file"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default FileCard;