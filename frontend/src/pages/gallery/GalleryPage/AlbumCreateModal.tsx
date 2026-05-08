import { useState, useRef } from "react";
import ModalLayout from "@components/common/ModalLayout";
import DatePicker from "@components/common/DatePicker";
import { AddPhotoAlternateIcon, CloseIcon, SpinnerIcon } from "@assets/icons";
import { MAX_PHOTOS, MAX_SIZE_MB, MAX_SIZE_BYTES, compressImage } from "@/utils/image";
import { useCreateAlbum } from "@/api/hooks/gallery/useCreateAlbum";
import type { GalleryCategory } from "@/api/gallery";

interface AlbumCreateModalProps {
  onClose: () => void;
}

const CATEGORIES: GalleryCategory[] = ["봉사활동", "대내활동", "대외활동", "버디활동", "기타"];

export default function AlbumCreateModal({ onClose }: AlbumCreateModalProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [category, setCategory] = useState<GalleryCategory | null>(null);
  const [coverImages, setCoverImages] = useState<File[]>([]);
  const [sizeError, setSizeError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createAlbum = useCreateAlbum();

  const canSubmit = title.trim().length > 0 && date !== null && category !== null;

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
    setCoverImages((prev) => [...prev, ...compressed].slice(0, MAX_PHOTOS));
  };

  const handleSubmit = () => {
    if (!canSubmit || !date || !category) return;
    createAlbum.mutate(
      { title: title.trim(), date, category, photos: coverImages },
      { onSuccess: onClose }
    );
  };

  return (
    <ModalLayout onClose={onClose} variant="form">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-on-surface font-headline">새 앨범 만들기</h2>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
        >
          <CloseIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-on-surface">
          앨범 제목 <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="예) 2025 봄 MT"
          maxLength={50}
          className="w-full px-4 py-3 bg-surface-container-low rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary-container/30 transition-all placeholder:text-on-surface-variant/50 placeholder:font-normal"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-on-surface">
          날짜 <span className="text-red-400">*</span>
        </label>
        <DatePicker value={date} onChange={setDate} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-on-surface">
          카테고리 <span className="text-red-400">*</span>
        </label>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                category === cat
                  ? "bg-primary-container text-white"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-on-surface">사진</label>
          <span className={`text-xs font-semibold ${coverImages.length >= MAX_PHOTOS ? "text-primary-container" : "text-on-surface-variant"}`}>
            {coverImages.length}/{MAX_PHOTOS}
          </span>
        </div>
        {coverImages.length < MAX_PHOTOS && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-outline-variant/50 rounded-xl px-6 py-6 flex flex-col items-center gap-2 cursor-pointer hover:border-primary-container/50 hover:bg-surface-container-low transition-all"
          >
            <AddPhotoAlternateIcon className="w-7 h-7 text-on-surface-variant" />
            <p className="text-sm text-on-surface-variant">클릭해서 사진 추가</p>
            <p className="text-xs text-on-surface-variant/60">
              최대 {MAX_PHOTOS}장 · 장당 {MAX_SIZE_MB}MB 이하 · JPG, PNG
            </p>
          </div>
        )}
        {sizeError && (
          <p className="text-xs text-red-400 bg-red-50 px-3 py-2 rounded-lg">{sizeError}</p>
        )}
        {createAlbum.isError && (
          <p className="text-xs text-red-400 bg-red-50 px-3 py-2 rounded-lg">
            앨범 생성에 실패했어요. 다시 시도해주세요.
          </p>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {coverImages.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mt-1 max-h-56 overflow-y-auto pr-1">
            {coverImages.map((file, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => setCoverImages((prev) => prev.filter((_, idx) => idx !== i))}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <CloseIcon className="w-4 h-4 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <button
          onClick={onClose}
          disabled={createAlbum.isPending}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-on-surface-variant bg-surface-container hover:bg-surface-container-high transition-all disabled:opacity-40"
        >
          취소
        </button>
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || createAlbum.isPending}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-primary-container text-white hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {createAlbum.isPending && (
            <SpinnerIcon className="w-4 h-4 animate-spin" />
          )}
          앨범 만들기
        </button>
      </div>
    </ModalLayout>
  );
}
