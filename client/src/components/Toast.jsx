import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 size={18} className="text-emerald-500" />,
    error: <AlertCircle size={18} className="text-rose-500" />,
    info: <Info size={18} className="text-blue-500" />,
  };

  return (
    <div className={`toast-container ${toast.type || 'info'}`}>
      <div className="toast-icon">
        {icons[toast.type] || icons.info}
      </div>
      <div className="toast-message">
        <p className="toast-title">{toast.title || (toast.type === 'error' ? 'Notice' : 'Success')}</p>
        <p className="toast-body">{toast.message}</p>
      </div>
      <button className="toast-close" onClick={onClose} aria-label="Dismiss notification">
        <X size={16} />
      </button>
    </div>
  );
}

