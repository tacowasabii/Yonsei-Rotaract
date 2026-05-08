import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "@components/layout/PageLayout";
import Lightbox from "@components/common/Lightbox";
import { ArrowBackIcon, AddPhotoAlternateIcon, DownloadIcon, DeleteIcon } from "@assets/icons";
import { PATHS } from "@/routes/paths";
import { MAX_PHOTOS, MAX_SIZE_MB, MAX_SIZE_BYTES, compressImage } from "@/utils/image";

const MOCK_ALBUMS = [
  { id: 1, title: "2025 대동제 봉사부스", date: "2025. 04", color: "bg-primary-fixed/40", accent: "text-primary-container" },
  { id: 2, title: "안산 연희동 벽화 봉사", date: "2025. 03", color: "bg-tertiary-fixed/40", accent: "text-tertiary-container" },
  { id: 3, title: "OB/YB 연합 MT", date: "2025. 03", color: "bg-secondary-fixed/40", accent: "text-on-secondary-fixed" },
  { id: 4, title: "신촌 무료급식소 봉사", date: "2025. 02", color: "bg-primary-fixed/30", accent: "text-primary-container" },
];

const MOCK_PHOTOS: Record<number, { id: number; color: string; size: "large" | "medium" | "small" }[]> = {
  1: [
    { id: 1, color: "bg-primary-fixed/40", size: "large" },
    { id: 2, color: "bg-primary-fixed/30", size: "small" },
    { id: 3, color: "bg-primary-fixed/20", size: "small" },
    { id: 4, color: "bg-primary-fixed/40", size: "medium" },
    { id: 5, color: "bg-primary-fixed/30", size: "small" },
    { id: 6, color: "bg-primary-fixed/20", size: "large" },
  ],
  2: [
    { id: 1, color: "bg-tertiary-fixed/40", size: "medium" },
    { id: 2, color: "bg-tertiary-fixed/30", size: "small" },
    { id: 3, color: "bg-tertiary-fixed/20", size: "large" },
    { id: 4, color: "bg-tertiary-fixed/40", size: "small" },
  ],
  3: [
    { id: 1, color: "bg-secondary-fixed/40", size: "large" },
    { id: 2, color: "bg-secondary-fixed/30", size: "small" },
    { id: 3, color: "bg-secondary-fixed/20", size: "medium" },
    { id: 4, color: "bg-secondary-fixed/40", size: "small" },
    { id: 5, color: "bg-secondary-fixed/30", size: "large" },
    { id: 6, color: "bg-secondary-fixed/20", size: "small" },
    { id: 7, color: "bg-secondary-fixed/40", size: "small" },
    { id: 8, color: "bg-secondary-fixed/30", size: "medium" },
  ],
  4: [],
};

export default function AlbumDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const albumId = Number(id);
  const album = MOCK_ALBUMS.find((a) => a.id === albumId);
  const [photos, setPhotos] = useState(MOCK_PHOTOS[albumId] ?? []);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [sizeError, setSizeError] = useState<string | null>(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  if (!album) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center py-24 text-on-surface-variant gap-3">
          <span className="material-symbols-outlined text-5xl">photo_library</span>
          <p className="font-semibold">앨범을 찾을 수 없어요.</p>
          <button
            onClick={() => navigate(PATHS.GALLERY)}
            className="text-sm text-primary-container font-semibold hover:underline"
          >
            사진첩으로 돌아가기
          </button>
        </div>
      </PageLayout>
    );
  }

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    setSizeError(null);
    const all = Array.from(files).filter((f) => f.type.startsWith("image/"));
    const oversized = all.filter((f) => f.size > MAX_SIZE_BYTES);
    if (oversized.length > 0) {
      setSizeError(`${oversized.length}장이 ${MAX_SIZE_MB}MB를 초과해 제외됐어요.`);
    }
    const valid = all.filter((f) => f.size <= MAX_SIZE_BYTES);
    const compressed = await Promise.all(valid.map(compressImage));
    const newPhotos = compressed.map((_, i) => ({
      id: Date.now() + i,
      color: "bg-primary-fixed/30",
      size: "medium" as const,
    }));
    setPhotos((prev) => [...prev, ...newPhotos].slice(0, MAX_PHOTOS));
  };

  const exitSelectMode = () => {
    setSelectMode(false);
    setSelected(new Set());
  };

  const toggleSelect = (photoId: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(photoId) ? next.delete(photoId) : next.add(photoId);
      return next;
    });
  };

  const handleDelete = () => {
    setPhotos((prev) => prev.filter((p) => !selected.has(p.id)));
    exitSelectMode();
  };

  const handleDownload = () => {
    // TODO: 실제 이미지 다운로드 연동
    exitSelectMode();
  };

  const handlePhotoClick = (photoId: number, index: number) => {
    if (selectMode) toggleSelect(photoId);
    else setLightboxIndex(index);
  };

  return (
    <PageLayout>
      <div className="flex items-center gap-2 mb-6 text-sm text-on-surface-variant">
        <button
          onClick={() => navigate(PATHS.GALLERY)}
          className="flex items-center gap-1 hover:text-primary-container transition-colors font-semibold"
        >
          <ArrowBackIcon className="w-4.5 h-4.5" />
          사진첩
        </button>
      </div>

      {/* 앨범 헤더 */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-on-surface font-headline">{album.title}</h1>
          <p className="text-sm text-on-surface-variant mt-1">{album.date} · {photos.length}장</p>
        </div>
        <div className="flex items-center gap-2">
          {selectMode && (
            <>
              <button
                onClick={() => {
                  const allSelected = selected.size === photos.length;
                  setSelected(allSelected ? new Set() : new Set(photos.map((p) => p.id)));
                }}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all"
              >
                {selected.size === photos.length ? "전체 해제" : "전체 선택"}
              </button>
              <button
                onClick={handleDownload}
                disabled={selected.size === 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-container text-on-surface text-sm font-semibold hover:bg-surface-container-high transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <DownloadIcon className="w-4 h-4" />
                다운로드{selected.size > 0 && ` (${selected.size})`}
              </button>
              <button
                onClick={handleDelete}
                disabled={selected.size === 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <DeleteIcon className="w-4 h-4" />
                삭제
              </button>
            </>
          )}
          {photos.length > 0 && (
            <button
              onClick={selectMode ? exitSelectMode : () => setSelectMode(true)}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all"
            >
              {selectMode ? "취소" : "선택"}
            </button>
          )}
          {!selectMode && (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={photos.length >= MAX_PHOTOS}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-container text-white text-sm font-semibold hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <AddPhotoAlternateIcon className="w-4.5 h-4.5" />
              사진 추가
            </button>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {sizeError && (
        <p className="text-xs text-red-400 bg-red-50 px-3 py-2 rounded-lg mb-4">{sizeError}</p>
      )}

      {photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-5">
          <div className="w-20 h-20 rounded-2xl bg-primary-fixed/30 flex items-center justify-center">
            <AddPhotoAlternateIcon className="w-10 h-10 text-primary-container/60" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-on-surface">아직 사진이 없어요</p>
            <p className="text-sm text-on-surface-variant mt-1">첫 번째 사진을 추가해보세요.</p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-container text-white text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            사진 추가하기
          </button>
        </div>
      ) : (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {photos.map((photo, i) => {
            const isSelected = selected.has(photo.id);
            return (
              <div
                key={photo.id}
                onClick={() => handlePhotoClick(photo.id, i)}
                className={`break-inside-avoid relative rounded-xl overflow-hidden cursor-pointer group ${photo.color} ${
                  photo.size === "large" ? "h-64" : photo.size === "medium" ? "h-48" : "h-36"
                } flex items-center justify-center transition-all ${
                  isSelected ? "ring-3 ring-primary-container ring-offset-2" : ""
                }`}
              >
                <span className="material-symbols-outlined text-3xl text-on-surface-variant/30">image</span>

                {!selectMode && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      zoom_in
                    </span>
                  </div>
                )}

                {selectMode && (
                  <div className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected ? "bg-primary-container border-primary-container" : "bg-white/80 border-white/80"
                  }`}>
                    {isSelected && <span className="material-symbols-outlined text-white text-sm">check</span>}
                  </div>
                )}

                {selectMode && isSelected && (
                  <div className="absolute inset-0 bg-primary-container/20" />
                )}
              </div>
            );
          })}
        </div>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </PageLayout>
  );
}
