import React from "react";
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from "lucide-react";
import { useToast } from "../../context/ToastContext";

const Toast = ({ id, message, type, onClose }) => {
  const getStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-emerald-50",
          border: "border-emerald-200",
          text: "text-emerald-800",
          icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
        };
      case "error":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          text: "text-red-800",
          icon: <AlertCircle className="w-5 h-5 text-red-600" />,
        };
      case "warning":
        return {
          bg: "bg-amber-50",
          border: "border-amber-200",
          text: "text-amber-800",
          icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
        };
      default:
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          text: "text-blue-800",
          icon: <Info className="w-5 h-5 text-blue-600" />,
        };
    }
  };

  const styles = getStyles();

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm
        ${styles.bg} ${styles.border} ${styles.text}
        animate-in slide-in-from-top-2 duration-200
      `}
    >
      {styles.icon}
      <span className="flex-1 text-sm font-medium">{message}</span>
      <button
        onClick={() => onClose(id)}
        className="p-1 hover:bg-black/5 rounded-md transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-2 w-full max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast {...toast} onClose={removeToast} />
        </div>
      ))}
    </div>
  );
};

export default Toast;
