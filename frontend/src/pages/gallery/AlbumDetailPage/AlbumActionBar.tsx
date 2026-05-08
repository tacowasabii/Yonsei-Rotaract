import { AddPhotoAlternateIcon, DownloadIcon, DeleteIcon } from "@assets/icons";

interface Props {
  isLoggedIn: boolean;
  isStaff: boolean;
  selectMode: boolean;
  selectedCount: number;
  totalCount: number;
  isUploadPending: boolean;
  isUploadDisabled: boolean;
  onEnterSelectMode: () => void;
  onExitSelectMode: () => void;
  onToggleSelectAll: () => void;
  onDownloadOpen: () => void;
  onDeletePhotos: () => void;
  onUpload: () => void;
  onDeleteAlbum: () => void;
}

export default function AlbumActionBar({
  isLoggedIn,
  isStaff,
  selectMode,
  selectedCount,
  totalCount,
  isUploadPending,
  isUploadDisabled,
  onEnterSelectMode,
  onExitSelectMode,
  onToggleSelectAll,
  onDownloadOpen,
  onDeletePhotos,
  onUpload,
  onDeleteAlbum,
}: Props) {
  const isAllSelected = selectedCount === totalCount;

  return (
    <div className="flex items-center gap-2">
      {isLoggedIn && selectMode && (
        <>
          <button
            onClick={onToggleSelectAll}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all"
          >
            {isAllSelected ? "전체 해제" : "전체 선택"}
          </button>
          <button
            onClick={onDownloadOpen}
            disabled={selectedCount === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-container text-on-surface text-sm font-semibold hover:bg-surface-container-high transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <DownloadIcon className="w-4 h-4" />
            다운로드{selectedCount > 0 && ` (${selectedCount})`}
          </button>
          {isStaff && (
            <button
              onClick={onDeletePhotos}
              disabled={selectedCount === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <DeleteIcon className="w-4 h-4" />
              삭제{selectedCount > 0 && ` (${selectedCount})`}
            </button>
          )}
        </>
      )}
      {isLoggedIn && totalCount > 0 && (
        <button
          onClick={selectMode ? onExitSelectMode : onEnterSelectMode}
          className="px-4 py-2 rounded-xl text-sm font-semibold bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all"
        >
          {selectMode ? "취소" : "선택"}
        </button>
      )}
      {isStaff && !selectMode && (
        <button
          onClick={onUpload}
          disabled={isUploadDisabled}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-container text-white text-sm font-semibold hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <AddPhotoAlternateIcon className="w-4.5 h-4.5" />
          {isUploadPending ? "업로드 중..." : "사진 추가"}
        </button>
      )}
      {isStaff && !selectMode && (
        <button
          onClick={onDeleteAlbum}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-container text-error text-sm font-semibold hover:bg-error/10 transition-all"
        >
          <DeleteIcon className="w-4 h-4" />
          앨범 삭제
        </button>
      )}
    </div>
  );
}
