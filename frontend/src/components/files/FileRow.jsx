import React from 'react';
import { MoreVertical, Share, Download, Trash2 } from 'lucide-react';
import FileIcon from './FileIcon';

const FileRow = ({ name, size, date, type, onShare, onDownload, onDelete }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition group">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <FileIcon type={type} />
        <div className="min-w-0">
          <h4 className="font-semibold text-slate-800 text-sm group-hover:text-blue-600 transition truncate pr-4">{name}</h4>
          <p className="text-xs text-slate-500">{size}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <span className="text-xs text-slate-400 font-medium hidden sm:block w-24 text-right">{date}</span>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {onShare && (
            <button 
              onClick={(e) => { e.stopPropagation(); onShare(); }}
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition"
              title="Share"
            >
              <Share className="w-4 h-4" />
            </button>
          )}
          {onDownload && (
            <button 
              onClick={(e) => { e.stopPropagation(); onDownload(); }}
              className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-full transition"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileRow;