import { useState, useEffect, useCallback } from "react";
import { CloseIcon } from "@assets/icons";

interface LightboxProps {
  photos: { id: string; url: string }[];
  initialIndex: number;
  onClose: () => void;
}

export default function Lightbox({ photos, initialIndex, onClose }: LightboxProps) {
  const [index, setIndex] = useState(initialIndex);

  const prev = useCallback(
    () => setIndex((i) => (i - 1 + photos.length) % photos.length),
    [photos.length]
  );
  const next = useCallback(
    () => setIndex((i) => (i + 1) % photos.length),
    [photos.length]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose, prev, next]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      >
        <CloseIcon className="w-5 h-5 text-white" />
      </button>

      <span className="absolute top-5 left-1/2 -translate-x-1/2 text-white/60 text-sm font-semibold">
        {index + 1} / {photos.length}
      </span>

      {photos.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className="absolute left-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <span className="material-symbols-outlined text-white">chevron_left</span>
        </button>
      )}

      <img
        src={photos[index].url}
        alt={`사진 ${index + 1}`}
        className="max-w-[80vw] max-h-[80vh] object-contain rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      />

      {photos.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="absolute right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <span className="material-symbols-outlined text-white">chevron_right</span>
        </button>
      )}
    </div>
  );
}
