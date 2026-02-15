import React from "react";
import { Inbox, FolderOpen } from "lucide-react";

const EmptyState = ({
  icon: Icon = Inbox,
  title,
  description,
  action,
  actionLabel,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="mb-4 p-4 bg-slate-50 rounded-full">
        <Icon className="w-12 h-12 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 mb-6 max-w-sm">{description}</p>
      {action && (
        <button
          onClick={action}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
        >
          {actionLabel || "Take Action"}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
