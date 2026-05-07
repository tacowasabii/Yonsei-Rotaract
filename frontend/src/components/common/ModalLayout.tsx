import { useRef } from "react";
import { useOutsideClick } from "@/hooks/useOutsideClick";

interface Props {
  onClose: () => void;
  variant?: "dialog" | "form";
  locked?: boolean;
  children: React.ReactNode;
}

export default function ModalLayout({ onClose, variant = "dialog", locked = false, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => { if (!locked) onClose(); });

  const overlayClass = variant === "dialog"
    ? "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
    : "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4";

  const containerClass = variant === "dialog"
    ? "bg-surface-container-lowest rounded-3xl p-6 shadow-xl w-full max-w-sm"
    : "bg-surface-container-lowest rounded-2xl shadow-card w-full max-w-lg flex flex-col gap-5 p-6";

  return (
    <div className={overlayClass}>
      <div ref={ref} className={containerClass}>
        {children}
      </div>
    </div>
  );
}
