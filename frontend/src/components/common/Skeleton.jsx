import React from "react";

const Skeleton = ({ width = "w-full", height = "h-4", className = "" }) => {
  return (
    <div
      className={`${width} ${height} bg-slate-200 rounded animate-pulse ${className}`}
    />
  );
};

export const SkeletonCard = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
    <Skeleton height="h-6" width="w-3/4" />
    <Skeleton height="h-4" width="w-full" />
    <Skeleton height="h-4" width="w-2/3" />
  </div>
);

export default Skeleton;
