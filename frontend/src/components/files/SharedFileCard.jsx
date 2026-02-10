import React from 'react';
import { Download, Clock, Ban, CheckCircle, MoreVertical } from 'lucide-react';
import FileIcon from './FileIcon';
import Button from '../common/Button';

const SharedFileCard = ({ name, size, type, owner, expiry, access, status }) => {
  
  // Helper to determine styles based on status
  const getStatusConfig = (s) => {
    switch(s) {
      case 'active': 
        return { 
          badgeColor: 'bg-emerald-100 text-emerald-700', 
          icon: <CheckCircle className="w-3 h-3" />, 
          label: 'Active',
          borderColor: 'border-emerald-500' // Optional active border
        };
      case 'expiring': 
        return { 
          badgeColor: 'bg-amber-100 text-amber-700', 
          icon: <Clock className="w-3 h-3" />, 
          label: 'Expiring Soon',
          borderColor: 'border-amber-500'
        };
      case 'expired': 
        return { 
          badgeColor: 'bg-rose-100 text-rose-700', 
          icon: <Ban className="w-3 h-3" />, 
          label: 'Expired',
          borderColor: 'border-rose-500'
        };
      default: return {};
    }
  };

  const config = getStatusConfig(status);
  const isExpired = status === 'expired';

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition group relative">
      
      {/* Status Badge */}
      <div className={`absolute top-4 left-4 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1.5 ${config.badgeColor}`}>
         {config.icon}
         {config.label}
      </div>

      {/* Menu Button */}
      <button className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition">
        <MoreVertical className="w-4 h-4" />
      </button>

      {/* Preview Icon Area */}
      <div className="h-32 bg-slate-50 rounded-xl mt-6 mb-4 flex items-center justify-center">
        <FileIcon type={type} className={`w-12 h-12 ${isExpired ? 'opacity-40 grayscale' : ''}`} />
      </div>

      {/* File Details */}
      <h3 className={`font-bold text-lg mb-1 truncate ${isExpired ? 'text-slate-400' : 'text-slate-800'}`}>{name}</h3>
      <p className="text-xs text-slate-400 mb-4">{size}</p>

      {/* Metadata Grid */}
      <div className="space-y-2 text-sm text-slate-600 mb-6 bg-slate-50/50 p-3 rounded-lg border border-slate-100">
        <div className="flex justify-between">
          <span className="text-slate-500 text-xs uppercase font-bold">Shared by</span>
          <span className="font-medium text-slate-900">{owner}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500 text-xs uppercase font-bold">Expires</span>
          <span className={`font-medium ${status === 'expiring' ? 'text-amber-600' : status === 'expired' ? 'text-rose-500' : 'text-emerald-600'}`}>
            {expiry}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-500 text-xs uppercase font-bold">Access</span>
          <span className="text-xs bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-600 font-medium shadow-sm">
            {access}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button 
          variant={isExpired ? "secondary" : "primary"} 
          className="flex-1 text-sm" 
          disabled={isExpired}
          icon={Download}
        >
          Download
        </Button>
      </div>
    </div>
  );
};

export default SharedFileCard;