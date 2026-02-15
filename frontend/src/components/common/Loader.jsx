import React from "react";

const Loader = ({ size = "md", variant = "primary" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const colorClasses = {
    primary: "border-blue-600 border-t-transparent",
    white: "border-white border-t-transparent",
    dark: "border-slate-900 border-t-transparent",
  };

  return (
    <div
      className={`${sizeClasses[size]} border-4 rounded-full animate-spin ${colorClasses[variant]}`}
    />
  );
};

export default Loader;
