import React, { useState, useEffect } from 'react';
import './Toast.css';

function Toast({ message, type = 'info', duration = 3000, onClose }) {
  const [visible, setVisible] = useState(Boolean(message));

  useEffect(() => {
    if (!message) {
      setVisible(false);
      return undefined;
    }

    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      if (typeof onClose === 'function') {
        onClose();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!visible || !message) {
    return null;
  }

  const handleClose = () => {
    setVisible(false);
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  return (
    <div
      className={`toast toast-${type}`}
      role={type === 'error' ? 'alert' : 'status'}
      aria-live="polite"
    >
      <span className="toast-message">{message}</span>
      <button
        type="button"
        className="toast-close"
        aria-label="Fechar notificação"
        onClick={handleClose}
      >
        ×
      </button>
    </div>
  );
}

export default Toast;
