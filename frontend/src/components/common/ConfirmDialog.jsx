import React from "react";
import { AlertCircle, X } from "lucide-react";
import Button from "./Button";

const ConfirmDialog = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  isDangerous = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onCancel}
      ></div>

      {/* Dialog Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div
          className={`flex justify-between items-center p-6 border-b ${isDangerous ? "border-red-100 bg-red-50" : "border-slate-100"}`}
        >
          <div className="flex items-center gap-3">
            <AlertCircle
              className={
                isDangerous ? "text-red-600 w-5 h-5" : "text-blue-600 w-5 h-5"
              }
            />
            <h3
              className={`text-lg font-bold ${isDangerous ? "text-red-900" : "text-slate-900"}`}
            >
              {title}
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p
            className={`text-sm ${isDangerous ? "text-red-700" : "text-slate-600"}`}
          >
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-slate-100 justify-end">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant={isDangerous ? "danger" : "primary"}
            onClick={onConfirm}
          >
            {isDangerous ? "Delete" : "Confirm"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
