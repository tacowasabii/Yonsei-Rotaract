import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageLayout from "@components/layout/PageLayout";

const mockUser = {
  name: "김연세",
  verified: true,
  role: "현역 회원",
};

type Visibility = "public" | "members";

export default function BoardWritePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isPromo = location.pathname.includes("/promo/");
  const boardType = isPromo ? "promo" : "free";
  const boardLabel = isPromo ? "홍보게시판" : "자유게시판";

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("public");
  const [images, setImages] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canSubmit = title.trim().length > 0 && content.trim().length > 0;

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const valid = Array.from(files).filter((f) => f.type.startsWith("image/"));
    setImages((prev) => [...prev, ...valid].slice(0, 5));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    navigate(`/board/${boardType}`);
  };

  return (
    <PageLayout>
      {/* Back */}
      <div className="flex items-center gap-2 mb-6 text-sm text-on-surface-variant">
        <button
          onClick={() => navigate(`/board/${boardType}`)}
          className="flex items-center gap-1 hover:text-primary-container transition-colors font-semibold"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          {boardLabel}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5 items-start">
        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-7 pb-5 border-b border-surface-container flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary-fixed text-primary-container">
                {boardLabel}
              </span>
              <h1 className="text-lg font-black text-on-surface font-headline">글쓰기</h1>
            </div>
          </div>

          {/* Form */}
          <div className="px-8 py-6 space-y-5">
            {/* Title */}
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                maxLength={100}
                className="w-full px-4 py-3 bg-surface-container-low rounded-xl text-base font-semibold outline-none focus:ring-2 focus:ring-primary-container/30 transition-all placeholder:text-on-surface-variant placeholder:font-normal"
              />
              <div className="text-right text-xs text-on-surface-variant mt-1.5">
                {title.length}/100
              </div>
            </div>

            {/* Content */}
            <div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용을 입력하세요..."
                rows={14}
                className="w-full px-4 py-3 bg-surface-container-low rounded-xl text-sm leading-relaxed outline-none focus:ring-2 focus:ring-primary-container/30 transition-all placeholder:text-on-surface-variant resize-none"
              />
              <div className="text-right text-xs text-on-surface-variant mt-1.5">
                {content.length}자
              </div>
            </div>

            {/* Image Attach */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-on-surface">사진 첨부</span>
                <span className="text-xs text-on-surface-variant">{images.length}/5</span>
              </div>

              {/* Drop Zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl px-6 py-8 flex flex-col items-center gap-2 cursor-pointer transition-all ${
                  isDragging
                    ? "border-primary-container bg-primary-fixed/20"
                    : "border-outline-variant/50 hover:border-primary-container/50 hover:bg-surface-container-low"
                }`}
              >
                <span className="material-symbols-outlined text-3xl text-on-surface-variant">add_photo_alternate</span>
                <p className="text-sm text-on-surface-variant text-center">
                  클릭하거나 파일을 드래그해서 올려주세요
                </p>
                <p className="text-xs text-on-surface-variant/60">JPG, PNG, GIF · 최대 5장</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />

              {/* Preview */}
              {images.length > 0 && (
                <div className="flex gap-3 mt-3 flex-wrap">
                  {images.map((file, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined text-white text-xl">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="px-8 pb-7 flex justify-end gap-3">
            <button
              onClick={() => navigate(`/board/${boardType}`)}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-on-surface-variant bg-surface-container hover:bg-surface-container-high transition-all"
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-primary-container text-white hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              등록하기
            </button>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          {/* Author Info */}
          <div className="bg-white rounded-2xl shadow-card px-6 py-5">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-4">작성자</p>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-primary-fixed flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl text-primary-container">person</span>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-on-surface">{mockUser.name}</span>
                  {mockUser.verified && (
                    <span
                      className="material-symbols-outlined text-sm text-surface-tint"
                      style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                      verified
                    </span>
                  )}
                </div>
                <span className="text-xs text-on-surface-variant">{mockUser.role}</span>
              </div>
            </div>
          </div>

          {/* Visibility */}
          <div className="bg-white rounded-2xl shadow-card px-6 py-5">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-4">공개 범위</p>
            <div className="space-y-2">
              {([
                { value: "public", label: "전체 공개", desc: "누구나 볼 수 있어요", icon: "public" },
                { value: "members", label: "회원만 공개", desc: "로그인한 회원만 볼 수 있어요", icon: "lock" },
              ] as { value: Visibility; label: string; desc: string; icon: string }[]).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setVisibility(opt.value)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left ${
                    visibility === opt.value
                      ? "border-primary-container bg-primary-fixed/20"
                      : "border-transparent bg-surface-container-low hover:bg-surface-container"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-xl ${
                      visibility === opt.value ? "text-primary-container" : "text-on-surface-variant"
                    }`}
                  >
                    {opt.icon}
                  </span>
                  <div>
                    <p className={`text-sm font-semibold ${visibility === opt.value ? "text-primary-container" : "text-on-surface"}`}>
                      {opt.label}
                    </p>
                    <p className="text-xs text-on-surface-variant">{opt.desc}</p>
                  </div>
                  {visibility === opt.value && (
                    <span className="material-symbols-outlined text-primary-container text-lg ml-auto" style={{ fontVariationSettings: '"FILL" 1' }}>
                      check_circle
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
