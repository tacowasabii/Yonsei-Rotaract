import { useState } from "react";
import type { AlbumPhoto } from "@/api/gallery";

export function usePhotoDownload() {
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (targets: AlbumPhoto[], albumTitle: string) => {
    setIsDownloading(true);
    setDownloadProgress(0);

    if (targets.length === 1) {
      const res = await fetch(targets[0].url);
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "photo-1.jpg";
      a.click();
      URL.revokeObjectURL(a.href);
      setDownloadProgress(1);
    } else {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      for (let i = 0; i < targets.length; i++) {
        const res = await fetch(targets[i].url);
        const blob = await res.blob();
        zip.file(`photo-${i + 1}.jpg`, blob);
        setDownloadProgress(i + 1);
      }
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(zipBlob);
      a.download = `${albumTitle}.zip`;
      a.click();
      URL.revokeObjectURL(a.href);
    }

    setIsDownloading(false);
    setDownloadOpen(false);
  };

  return { downloadOpen, setDownloadOpen, downloadProgress, isDownloading, handleDownload };
}
