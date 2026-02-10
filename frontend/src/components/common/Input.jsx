import React from 'react';

const Input = ({ label, type = "text", className = "", error, ...props }) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`
          w-full p-3 bg-slate-50 border rounded-xl outline-none text-sm font-medium text-slate-800 transition
          focus:bg-white focus:ring-2 focus:ring-blue-500/20
          ${error ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'}
        `}
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default Input;