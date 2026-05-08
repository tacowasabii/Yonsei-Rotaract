import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "@components/layout/PageLayout";
import Lightbox from "@components/common/Lightbox";
import DeleteConfirmModal from "@components/common/DeleteConfirmModal";
import { ArrowBackIcon, AddPhotoAlternateIcon, SpinnerIcon, AddIcon } from "@assets/icons";
import { PATHS } from "@/routes/paths";
import { MAX_PHOTOS, MAX_SIZE_MB, MAX_SIZE_BYTES } from "@/utils/image";
import { useIsStaff, useIsLoggedIn } from "@/contexts/AuthContext";
import { useAlbum } from "@/api/hooks/gallery/useAlbum";
import { useAlbumPhotos } from "@/api/hooks/gallery/useAlbumPhotos";
import { useUploadPhotos } from "@/api/hooks/gallery/useUploadPhotos";
import { useDeletePhotos } from "@/api/hooks/gallery/useDeletePhotos";
import { useSoftDeleteAlbum } from "@/api/hooks/gallery/useSoftDeleteAlbum";
import type { AlbumPhoto } from "@/api/gallery";
import DownloadModal from "./DownloadModal";
import AlbumActionBar from "./AlbumActionBar";
import PhotoGridItem from "./PhotoGridItem";
import { usePhotoSelection } from "./usePhotoSelection";
import { usePhotoDownload } from "./usePhotoDownload";

export default function AlbumDetailPage() {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isLoggedIn = useIsLoggedIn();
  const isStaff = useIsStaff();

  const { data: album, isLoading: albumLoading, isError: albumError } = useAlbum(id);
  const { data: photos = [], isLoading: photosLoading } = useAlbumPhotos(id);
  const uploadPhotos = useUploadPhotos(id);
  const deletePhotos = useDeletePhotos(id);
  const deleteAlbum = useSoftDeleteAlbum();

  const selection = usePhotoSelection(photos);
  const download = usePhotoDownload();

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [sizeError, setSizeError] = useState<string | null>(null);
  const [deletePhotoConfirm, setDeletePhotoConfirm] = useState(false);
  const [deleteAlbumConfirm, setDeleteAlbumConfirm] = useState(false);

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
    uploadPhotos.mutate(valid.slice(0, MAX_PHOTOS - photos.length));
  };

  const handleDeleteConfirm = () => {
    const targets = photos
      .filter((p) => selection.selected.has(p.id))
      .map((p: AlbumPhoto) => ({ id: p.id, storage_path: p.storage_path }));
    deletePhotos.mutate(targets, {
      onSuccess: () => {
        selection.exitSelectMode();
        setDeletePhotoConfirm(false);
      },
    });
  };

  const handlePhotoClick = (photoId: string, index: number) => {
    if (selection.selectMode) selection.toggleSelect(photoId);
    else setLightboxIndex(index);
  };

  const [y, m] = album.date.split("-");
  const dateLabel = `${y}. ${parseInt(m)}.`;

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

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-on-surface font-headline">{album.title}</h1>
          <p className="text-sm text-on-surface-variant mt-1">{dateLabel} · {photos.length}장</p>
        </div>
        <AlbumActionBar
          isLoggedIn={isLoggedIn}
          isStaff={isStaff}
          selectMode={selection.selectMode}
          selectedCount={selection.selected.size}
          totalCount={photos.length}
          isUploadPending={uploadPhotos.isPending}
          isUploadDisabled={photos.length >= MAX_PHOTOS || uploadPhotos.isPending}
          onEnterSelectMode={() => selection.setSelectMode(true)}
          onExitSelectMode={selection.exitSelectMode}
          onToggleSelectAll={selection.toggleSelectAll}
          onDownloadOpen={() => download.setDownloadOpen(true)}
          onDeletePhotos={() => setDeletePhotoConfirm(true)}
          onUpload={() => fileInputRef.current?.click()}
          onDeleteAlbum={() => setDeleteAlbumConfirm(true)}
        />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => { handleFiles(e.target.files); e.currentTarget.value = ""; }}
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
              disabled={uploadPhotos.isPending}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-container text-white text-sm font-semibold hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {uploadPhotos.isPending
                ? <SpinnerIcon className="w-5 h-5 animate-spin" />
                : <AddIcon className="w-5 h-5" />}
              {uploadPhotos.isPending ? "업로드 중..." : "사진 추가하기"}
            </button>
          )}
          {uploadPhotos.error && (
            <p className="text-xs text-red-400">
              {uploadPhotos.error instanceof Error ? uploadPhotos.error.message : "업로드에 실패했어요."}
            </p>
          )}
        </div>
      ) : (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {photos.map((photo, i) => (
            <PhotoGridItem
              key={photo.id}
              photo={photo}
              index={i}
              isSelected={selection.selected.has(photo.id)}
              selectMode={selection.selectMode}
              isLoggedIn={isLoggedIn}
              onClick={handlePhotoClick}
            />
          ))}
        </div>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          photos={photos.map((p) => ({ id: p.id, url: p.url }))}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      {deletePhotoConfirm && (
        <DeleteConfirmModal
          title="사진 삭제"
          description={`선택한 ${selection.selected.size}장을 삭제합니다. 복구할 수 없어요.`}
          isPending={deletePhotos.isPending}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletePhotoConfirm(false)}
        />
      )}

      {download.downloadOpen && (
        <DownloadModal
          count={selection.selected.size}
          isPending={download.isDownloading}
          progress={download.downloadProgress}
          onConfirm={() => {
            const targets = photos.filter((p) => selection.selected.has(p.id));
            download.handleDownload(targets, album.title).then(selection.exitSelectMode);
          }}
          onCancel={() => { if (!download.isDownloading) download.setDownloadOpen(false); }}
        />
      )}

      {deleteAlbumConfirm && (
        <DeleteConfirmModal
          title="앨범 삭제"
          description={`"${album.title}" 앨범을 삭제합니다. 복구할 수 없어요.`}
          isPending={deleteAlbum.isPending}
          onConfirm={() => deleteAlbum.mutate(id, { onSuccess: () => navigate(PATHS.GALLERY) })}
          onCancel={() => setDeleteAlbumConfirm(false)}
        />
      )}
    </PageLayout>
  );
}
