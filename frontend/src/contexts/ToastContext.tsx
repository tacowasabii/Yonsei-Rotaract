import { createContext, useContext, useState, useCallback } from "react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const ICONS: Record<ToastType, string> = {
  success: "check_circle",
  error: "error",
  info: "info",
};

const STYLES: Record<ToastType, string> = {
  success: "bg-surface-container-lowest text-on-surface border-outline-variant shadow-card",
  error: "bg-surface-container-lowest text-on-surface border-outline-variant shadow-card",
  info: "bg-surface-container-lowest text-on-surface border-outline-variant shadow-card",
};

const ICON_STYLES: Record<ToastType, string> = {
  success: "text-emerald-500",
  error: "text-error",
  info: "text-primary-container",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  function dismiss(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-200 flex flex-col gap-2 items-center pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-lg text-sm font-semibold animate-slide-up ${STYLES[toast.type]}`}
          >
            <span className={`material-symbols-outlined text-[20px] shrink-0 ${ICON_STYLES[toast.type]}`}>
              {ICONS[toast.type]}
            </span>
            <span>{toast.message}</span>
            <button
              onClick={() => dismiss(toast.id)}
              className="ml-1 text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
