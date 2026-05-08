import { useRef } from "react";
import { useOutsideClick } from "@/hooks/useOutsideClick";

interface ConfirmModalProps {
  title: string;
  message: React.ReactNode;
  icon: string;
  isDestructive: boolean;
  confirmLabel: string;
  onConfirm: () => void;
  onClose: () => void;
  isPending?: boolean;
}

export default function ConfirmModal({
  title,
  message,
  icon,
  isDestructive,
  confirmLabel,
  onConfirm,
  onClose,
  isPending = false,
}: ConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  useOutsideClick(modalRef, () => { if (!isPending) onClose(); });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div ref={modalRef} className="bg-surface-container-lowest rounded-3xl p-6 shadow-xl w-full max-w-sm">
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              isDestructive ? "bg-error/10" : "bg-primary-container/20"
            }`}
          >
            <span
              className={`material-symbols-outlined text-xl ${
                isDestructive ? "text-error" : "text-primary-container"
              }`}
            >
              {icon}
            </span>
          </div>
          <h2 className="font-headline font-bold text-on-surface text-lg">{title}</h2>
        </div>
        <p className="text-sm text-on-surface-variant mb-6">{message}</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 text-sm font-bold text-on-surface-variant rounded-full hover:bg-surface-container transition-colors disabled:opacity-50"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className={`flex items-center gap-1.5 px-5 py-2 text-sm font-bold rounded-full transition-all disabled:opacity-50 ${
              isDestructive
                ? "bg-error text-white hover:opacity-80"
                : "bg-primary-container text-white hover:opacity-80"
            }`}
          >
            {isPending && (
              <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
