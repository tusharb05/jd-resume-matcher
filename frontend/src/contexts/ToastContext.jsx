import { createContext, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = (id) => setToasts((p) => p.filter((t) => t.id !== id));

  const pushToast = (message, type = "error") => {
    const id = crypto.randomUUID();
    const toast = { id, message, type };
    setToasts((p) => [...p, toast]);

    // auto-remove 10s
    window.setTimeout(() => removeToast(id), 10_000);
  };

  const value = useMemo(
    () => ({ toasts, pushToast, removeToast }),
    [toasts]
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
