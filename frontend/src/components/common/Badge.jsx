import React from 'react';

const Badge = ({ children, variant = 'blue' }) => {
  const variants = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-emerald-100 text-emerald-700",
    red: "bg-rose-100 text-rose-700",
    yellow: "bg-amber-100 text-amber-700",
    slate: "bg-slate-100 text-slate-600"
  };

  return (
    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${variants[variant]}`}>
      {children}
    </span>
  );
};

export default Badge;