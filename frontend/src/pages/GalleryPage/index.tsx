import { useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import PageHeader from "../components/layout/PageHeader";

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

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState<"albums" | "all">("albums");
  const [activeCategory, setActiveCategory] = useState("전체");
  const [hoveredPhoto, setHoveredPhoto] = useState<number | null>(null);

  const filteredPhotos =
    activeCategory === "전체"
      ? photos
      : photos.filter((p) => p.category === activeCategory);

  return (
    <PageLayout>
      <PageHeader icon="photo_library" title="사진첩" subtitle="로타랙트의 소중한 추억들을 사진으로 만나보세요." />

      {/* Tab Toggle */}
      <div className="flex gap-2 mb-6">
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

      {activeTab === "albums" ? (
        /* Album Grid */
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
      ) : (
        /* All Photos */
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
      )}
    </PageLayout>
  );
}
