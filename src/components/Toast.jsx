import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import './Toast.css';

const ToastContext = createContext(null);

let _toastFn = null;

export function useToast() {
  return useContext(ToastContext);
}

// Global toast trigger (usable outside React components)
export function toast(msg, type = 'info', duration = 4000) {
  if (_toastFn) _toastFn(msg, type, duration);
}

export default function Toast() {
  const [items, setItems] = useState([]);

  _toastFn = useCallback((msg, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev.slice(-4), { id, msg, type }]);
    setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), duration);
  }, []);

  function dismiss(id) {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {items.map((item) => (
        <div key={item.id} className={`toast toast--${item.type}`}>
          <span className="toast__icon">{ICONS[item.type]}</span>
          <span className="toast__msg">{item.msg}</span>
          <button className="toast__close" onClick={() => dismiss(item.id)}>✕</button>
        </div>
      ))}
    </div>
  );
}

const ICONS = {
  success: '✓',
  danger: '✕',
  warning: '⚠',
  info: 'ℹ',
};
