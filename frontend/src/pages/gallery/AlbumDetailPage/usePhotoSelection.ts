import { useState } from "react";
import type { AlbumPhoto } from "@/api/gallery";

export function usePhotoSelection(photos: AlbumPhoto[]) {
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const exitSelectMode = () => {
    setSelectMode(false);
    setSelected(new Set());
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelected(selected.size === photos.length ? new Set() : new Set(photos.map((p) => p.id)));
  };

  return { selectMode, setSelectMode, selected, toggleSelect, toggleSelectAll, exitSelectMode };
}
