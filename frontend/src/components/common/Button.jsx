import React from 'react';

const Button = ({ children, variant = 'primary', className = "", icon: Icon, ...props }) => {
  const baseStyle = "px-6 py-2.5 rounded-lg font-medium transition flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200",
    ghost: "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </button>
  );
};

export default Button;