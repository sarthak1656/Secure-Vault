import React from 'react';

const ProgressBar = ({ progress, color = "bg-blue-600", className = "" }) => {
  return (
    <div className={`w-full bg-slate-100 rounded-full h-2 overflow-hidden ${className}`}>
      <div 
        className={`h-full rounded-full transition-all duration-500 ease-out ${color}`} 
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;