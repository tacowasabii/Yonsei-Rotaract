import { useState, useRef, useEffect } from "react";
import PageLayout from "@components/layout/PageLayout";
import PageHeader from "@components/layout/PageHeader";
import ModalLayout from "@components/common/ModalLayout";
import { PhotoLibraryIcon, AddPhotoAlternateIcon, CloseIcon, CalendarMonthIcon } from "@assets/icons";

const MONTHS = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

function DatePicker({ value, onChange }: { value: Date | null; onChange: (d: Date) => void }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(value?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(value?.getMonth() ?? today.getMonth());
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0); }
    else setViewMonth((m) => m + 1);
  };

  const displayValue = value
    ? `${value.getFullYear()}. ${value.getMonth() + 1}. ${value.getDate()}.`
    : "";

  const isSelected = (day: number) =>
    value?.getFullYear() === viewYear && value?.getMonth() === viewMonth && value?.getDate() === day;

  const isToday = (day: number) =>
    today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === day;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full px-4 py-3 bg-surface-container-low rounded-xl text-sm font-medium outline-none text-left transition-all ${
          open ? "ring-2 ring-primary-container/30" : ""
        } ${displayValue ? "text-on-surface" : "text-on-surface-variant/50"}`}
      >
        {displayValue || "날짜 선택"}
        <CalendarMonthIcon className="w-4 h-4 text-on-surface-variant float-right mt-0.5" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 z-50 bg-surface-container-lowest rounded-2xl shadow-xl p-4 w-72">
          {/* 월 네비게이션 */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={prevMonth}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-lg text-on-surface-variant">chevron_left</span>
            </button>
            <span className="text-sm font-bold text-on-surface">
              {viewYear}년 {MONTHS[viewMonth]}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-lg text-on-surface-variant">chevron_right</span>
            </button>
          </div>

          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 mb-1">
            {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
              <div key={d} className="text-center text-xs font-semibold text-on-surface-variant py-1">{d}</div>
            ))}
          </div>

          {/* 날짜 그리드 */}
          <div className="grid grid-cols-7 gap-y-1">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => { onChange(new Date(viewYear, viewMonth, day)); setOpen(false); }}
                className={`w-8 h-8 mx-auto flex items-center justify-center rounded-full text-sm font-medium transition-all ${
                  isSelected(day)
                    ? "bg-primary-container text-white"
                    : isToday(day)
                    ? "bg-primary-fixed/40 text-primary-container font-bold"
                    : "hover:bg-surface-container text-on-surface"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const albums = [
  {
    id: 1,
    title: "2025 대동제 봉사부스",
    date: "2025. 04",
    count: 24,
    category: "이벤트",
    color: "bg-primary-fixed/40",
    accent: "text-primary-container",
  },
  {
    id: 2,
    title: "안산 연희동 벽화 봉사",
    date: "2025. 03",
    count: 38,
    category: "봉사활동",
    color: "bg-tertiary-fixed/40",
    accent: "text-tertiary-container",
  },
  {
    id: 3,
    title: "OB/YB 연합 MT",
    date: "2025. 03",
    count: 56,
    category: "모임",
    color: "bg-secondary-fixed/40",
    accent: "text-on-secondary-fixed",
  },
  {
    id: 4,
    title: "신촌 무료급식소 봉사",
    date: "2025. 02",
    count: 19,
    category: "봉사활동",
    color: "bg-primary-fixed/30",
    accent: "text-primary-container",
  },
];

const photos = [
  { id: 1, album: "OB/YB 연합 MT", category: "모임", color: "bg-secondary-fixed/30", size: "large" },
  { id: 2, album: "안산 연희동 벽화 봉사", category: "봉사활동", color: "bg-tertiary-fixed/30", size: "small" },
  { id: 3, album: "2025 대동제 봉사부스", category: "이벤트", color: "bg-primary-fixed/30", size: "small" },
  { id: 4, album: "신촌 무료급식소 봉사", category: "봉사활동", color: "bg-primary-fixed/40", size: "small" },
  { id: 5, album: "OB/YB 연합 MT", category: "모임", color: "bg-secondary-fixed/40", size: "medium" },
  { id: 6, album: "안산 연희동 벽화 봉사", category: "봉사활동", color: "bg-tertiary-fixed/20", size: "small" },
  { id: 7, album: "2025 대동제 봉사부스", category: "이벤트", color: "bg-primary-fixed/20", size: "large" },
  { id: 8, album: "신촌 무료급식소 봉사", category: "봉사활동", color: "bg-tertiary-fixed/30", size: "small" },
  { id: 9, album: "OB/YB 연합 MT", category: "모임", color: "bg-secondary-fixed/30", size: "small" },
  { id: 10, album: "안산 연희동 벽화 봉사", category: "봉사활동", color: "bg-primary-fixed/30", size: "medium" },
  { id: 11, album: "2025 대동제 봉사부스", category: "이벤트", color: "bg-primary-fixed/40", size: "small" },
  { id: 12, album: "신촌 무료급식소 봉사", category: "봉사활동", color: "bg-tertiary-fixed/40", size: "small" },
];

const categories = ["전체", "봉사활동", "이벤트", "모임"];

function AlbumEmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-5">
      <div className="w-20 h-20 rounded-2xl bg-primary-fixed/30 flex items-center justify-center">
        <PhotoLibraryIcon className="w-10 h-10 text-primary-container/60" />
      </div>
      <div className="text-center">
        <p className="font-semibold text-on-surface">아직 등록된 앨범이 없어요</p>
        <p className="text-sm text-on-surface-variant mt-1">첫 번째 앨범을 만들어 추억을 기록해보세요.</p>
      </div>
      <button
        onClick={onCreateClick}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-container text-white text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
      >
        <span className="material-symbols-outlined text-lg">add</span>
        새 앨범 만들기
      </button>
    </div>
  );
}

function PhotoEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-20 h-20 rounded-2xl bg-primary-fixed/30 flex items-center justify-center">
        <AddPhotoAlternateIcon className="w-10 h-10 text-primary-container/60" />
      </div>
      <div className="text-center">
        <p className="font-semibold text-on-surface">등록된 사진이 없어요</p>
        <p className="text-sm text-on-surface-variant mt-1">앨범을 만들고 사진을 추가해보세요.</p>
      </div>
    </div>
  );
}

interface AlbumCreateModalProps {
  onClose: () => void;
}

const MAX_PHOTOS = 30;
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const MAX_DIMENSION = 1280;

function compressImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const { width, height } = img;
      const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => resolve(blob ? new File([blob], file.name, { type: "image/jpeg" }) : file),
        "image/jpeg",
        0.75
      );
    };
    img.src = url;
  });
}

function AlbumCreateModal({ onClose }: AlbumCreateModalProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [coverImages, setCoverImages] = useState<File[]>([]);
  const [sizeError, setSizeError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canSubmit = title.trim().length > 0 && date !== null;

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
    if (!canSubmit) return;
    // TODO: API 연동
    onClose();
  };

  return (
    <ModalLayout onClose={onClose} variant="form">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-on-surface font-headline">새 앨범 만들기</h2>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
        >
          <CloseIcon className="w-5 h-5" />
        </button>
      </div>

      {/* 앨범 제목 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-on-surface">앨범 제목 <span className="text-red-400">*</span></label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="예) 2025 봄 MT"
          maxLength={50}
          className="w-full px-4 py-3 bg-surface-container-low rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary-container/30 transition-all placeholder:text-on-surface-variant/50 placeholder:font-normal"
        />
      </div>

      {/* 날짜 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-on-surface">날짜 <span className="text-red-400">*</span></label>
        <DatePicker value={date} onChange={setDate} />
      </div>

      {/* 사진 */}
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
            <p className="text-xs text-on-surface-variant/60">최대 {MAX_PHOTOS}장 · 장당 {MAX_SIZE_MB}MB 이하 · JPG, PNG</p>
          </div>
        )}
        {sizeError && (
          <p className="text-xs text-red-400 bg-red-50 px-3 py-2 rounded-lg">{sizeError}</p>
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

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-1">
        <button
          onClick={onClose}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-on-surface-variant bg-surface-container hover:bg-surface-container-high transition-all"
        >
          취소
        </button>
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="px-5 py-2.5 rounded-xl text-sm font-bold bg-primary-container text-white hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          앨범 만들기
        </button>
      </div>
    </ModalLayout>
  );
}

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState<"albums" | "all">("albums");
  const [activeCategory, setActiveCategory] = useState("전체");
  const [hoveredPhoto, setHoveredPhoto] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredPhotos =
    activeCategory === "전체"
      ? photos
      : photos.filter((p) => p.category === activeCategory);

  const isEmpty = albums.length === 0;
  const isPhotosEmpty = photos.length === 0;

  return (
    <PageLayout>
      <PageHeader iconNode={<PhotoLibraryIcon />} title="사진첩" subtitle="로타랙트의 소중한 추억들을 사진으로 만나보세요." />

      {/* Tab Toggle + 새 앨범 버튼 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("albums")}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              activeTab === "albums"
                ? "bg-primary-container text-white"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            앨범별 보기
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              activeTab === "all"
                ? "bg-primary-container text-white"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            전체 사진
          </button>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold bg-primary-container text-white hover:opacity-90 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-base">add</span>
          새 앨범
        </button>
      </div>

      {activeTab === "albums" ? (
        isEmpty ? (
          <AlbumEmptyState onCreateClick={() => setShowCreateModal(true)} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {albums.map((album) => (
              <div
                key={album.id}
                className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-card hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group"
              >
                {/* Album Cover */}
                <div className={`h-52 ${album.color} relative flex items-center justify-center`}>
                  <div className="grid grid-cols-2 gap-2 p-4 w-full h-full">
                    {[0, 1, 2, 3].map((j) => (
                      <div
                        key={j}
                        className={`rounded-xl ${j === 0 ? album.color : "bg-white/20"} flex items-center justify-center`}
                      >
                        <span className="material-symbols-outlined text-2xl text-on-surface-variant/30">
                          image
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className={`text-xs font-bold ${album.accent} bg-white/80 px-2 py-0.5 rounded-full`}>
                      {album.category}
                    </span>
                  </div>
                </div>

                {/* Album Info */}
                <div className="p-5">
                  <h3 className="font-headline font-bold text-on-surface group-hover:text-primary-container transition-colors">
                    {album.title}
                  </h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-on-surface-variant">{album.date}</span>
                    <span className="text-sm font-semibold text-primary-container">
                      {album.count}장
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        isPhotosEmpty ? (
          <PhotoEmptyState />
        ) : (
          <>
            <div className="flex gap-2 flex-wrap mb-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                    activeCategory === cat
                      ? "bg-primary-container text-white"
                      : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {filteredPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className={`break-inside-avoid relative rounded-xl overflow-hidden cursor-pointer group ${photo.color} ${
                    photo.size === "large" ? "h-64" : photo.size === "medium" ? "h-48" : "h-36"
                  } flex items-center justify-center`}
                  onMouseEnter={() => setHoveredPhoto(photo.id)}
                  onMouseLeave={() => setHoveredPhoto(null)}
                >
                  <span className="material-symbols-outlined text-3xl text-on-surface-variant/30">
                    image
                  </span>

                  {/* Hover Overlay */}
                  <div
                    className={`absolute inset-0 bg-primary/60 flex flex-col items-center justify-center transition-opacity duration-200 ${
                      hoveredPhoto === photo.id ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <span className="material-symbols-outlined text-white text-3xl mb-1">zoom_in</span>
                    <p className="text-white text-xs font-semibold text-center px-2 leading-tight">
                      {photo.album}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )
      )}

      {showCreateModal && (
        <AlbumCreateModal onClose={() => setShowCreateModal(false)} />
      )}
    </PageLayout>
  );
}
