import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "@components/layout/PageLayout";
import Lightbox from "@components/common/Lightbox";
import { ArrowBackIcon, AddPhotoAlternateIcon, DownloadIcon, DeleteIcon, SpinnerIcon, AddIcon } from "@assets/icons";
import { PATHS } from "@/routes/paths";
import { MAX_PHOTOS, MAX_SIZE_MB, MAX_SIZE_BYTES } from "@/utils/image";
import { useIsStaff } from "@/contexts/AuthContext";
import { useAlbum } from "@/api/hooks/gallery/useAlbum";
import { useAlbumPhotos } from "@/api/hooks/gallery/useAlbumPhotos";
import { useUploadPhotos } from "@/api/hooks/gallery/useUploadPhotos";
import { useDeletePhotos } from "@/api/hooks/gallery/useDeletePhotos";
import type { AlbumPhoto } from "@/api/gallery";

export default function AlbumDetailPage() {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isStaff = useIsStaff();

  const { data: album, isLoading: albumLoading, isError: albumError } = useAlbum(id);
  const { data: photos = [], isLoading: photosLoading } = useAlbumPhotos(id);
  const uploadPhotos = useUploadPhotos(id);
  const deletePhotos = useDeletePhotos(id);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [sizeError, setSizeError] = useState<string | null>(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  if (albumLoading || photosLoading) {
    return (
      <PageLayout>
        <div className="flex justify-center py-24">
          <SpinnerIcon className="w-8 h-8 animate-spin" />
        </div>
      </PageLayout>
    );
  }

  if (albumError || !album) {
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
    const remaining = MAX_PHOTOS - photos.length;
    uploadPhotos.mutate(valid.slice(0, remaining));
  };

  const exitSelectMode = () => {
    setSelectMode(false);
    setSelected(new Set());
  };

  const toggleSelect = (photoId: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(photoId)) next.delete(photoId);
      else next.add(photoId);
      return next;
    });
  };

  const handleDelete = () => {
    const targets = photos
      .filter((p) => selected.has(p.id))
      .map((p: AlbumPhoto) => ({ id: p.id, storage_path: p.storage_path }));
    deletePhotos.mutate(targets, { onSuccess: exitSelectMode });
  };

  const handleDownload = () => {
    // TODO: 실제 이미지 다운로드 연동
    exitSelectMode();
  };

  const handlePhotoClick = (photoId: string, index: number) => {
    if (selectMode) toggleSelect(photoId);
    else setLightboxIndex(index);
  };

  const dateLabel = new Date(album.date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
  });

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
          <p className="text-sm text-on-surface-variant mt-1">{dateLabel} · {photos.length}장</p>
        </div>
        <div className="flex items-center gap-2">
          {isStaff && selectMode && (
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
                disabled={selected.size === 0 || deletePhotos.isPending}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <DeleteIcon className="w-4 h-4" />
                삭제{deletePhotos.isPending ? "..." : ""}
              </button>
            </>
          )}
          {isStaff && photos.length > 0 && (
            <button
              onClick={selectMode ? exitSelectMode : () => setSelectMode(true)}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all"
            >
              {selectMode ? "취소" : "선택"}
            </button>
          )}
          {isStaff && !selectMode && (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={photos.length >= MAX_PHOTOS || uploadPhotos.isPending}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-container text-white text-sm font-semibold hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <AddPhotoAlternateIcon className="w-4.5 h-4.5" />
              {uploadPhotos.isPending ? "업로드 중..." : "사진 추가"}
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
          {isStaff && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-container text-white text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
            >
              <AddIcon className="w-5 h-5" />
              사진 추가하기
            </button>
          )}
        </div>
      ) : (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {photos.map((photo, i) => {
            const isSelected = selected.has(photo.id);
            return (
              <div
                key={photo.id}
                onClick={() => handlePhotoClick(photo.id, i)}
                className={`break-inside-avoid relative rounded-xl overflow-hidden cursor-pointer group transition-all ${
                  isSelected ? "ring-3 ring-primary-container ring-offset-2" : ""
                }`}
              >
                <img src={photo.url} alt="" className="w-full h-auto" />

                {!selectMode && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      zoom_in
                    </span>
                  </div>
                )}

                {isStaff && selectMode && (
                  <div className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected ? "bg-primary-container border-primary-container" : "bg-white/80 border-white/80"
                  }`}>
                    {isSelected && <span className="material-symbols-outlined text-white text-sm">check</span>}
                  </div>
                )}

                {isStaff && selectMode && isSelected && (
                  <div className="absolute inset-0 bg-primary-container/20" />
                )}
              </div>
            );
          })}
        </div>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          photos={photos.map((p) => ({ id: p.id, url: p.url }))}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </PageLayout>
  );
}
