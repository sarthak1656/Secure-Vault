import React from 'react';
import { MoreVertical } from 'lucide-react';
import FileIcon from './FileIcon';

const FileRow = ({ name, size, date, type }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition group">
      <div className="flex items-center gap-4">
        <FileIcon type={type} />
        <div>
          <h4 className="font-semibold text-slate-800 text-sm group-hover:text-blue-600 transition">{name}</h4>
          <p className="text-xs text-slate-500">{size}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <span className="text-xs text-slate-400 font-medium hidden sm:block">{date}</span>
        <button className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200 transition">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default FileRow;