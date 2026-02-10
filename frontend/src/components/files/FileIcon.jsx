import React from 'react';
import { FileText, File, Image as ImageIcon, FileCode, Music, Video } from 'lucide-react';

const FileIcon = ({ type, className = "w-6 h-6" }) => {
  const getStyle = (t) => {
    switch(t) {
      case 'pdf': return { icon: FileText, color: 'text-red-500', bg: 'bg-red-50' };
      case 'doc': 
      case 'docx': return { icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' };
      case 'xls': 
      case 'xlsx': return { icon: FileText, color: 'text-emerald-500', bg: 'bg-emerald-50' };
      case 'ppt': 
      case 'pptx': return { icon: FileText, color: 'text-orange-500', bg: 'bg-orange-50' };
      case 'jpg':
      case 'png': return { icon: ImageIcon, color: 'text-purple-500', bg: 'bg-purple-50' };
      default: return { icon: File, color: 'text-slate-500', bg: 'bg-slate-50' };
    }
  };

  const style = getStyle(type);
  const IconComponent = style.icon;

  return (
    <div className={`rounded-lg flex items-center justify-center ${style.bg} p-2`}>
      <IconComponent className={`${className} ${style.color}`} />
    </div>
  );
};

export default FileIcon;