import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@components/layout/PageLayout";
import PageHeader from "@components/layout/PageHeader";
import Lightbox from "@components/common/Lightbox";
import { PhotoLibraryIcon, AddPhotoAlternateIcon } from "@assets/icons";
import { PATHS } from "@/routes/paths";
import { CATEGORY_STYLES, CATEGORY_DEFAULT } from "@/constants/gallery";
import AlbumCreateModal from "./AlbumCreateModal";

const albums = [
  { id: 1, title: "2025 대동제 봉사부스", date: "2025. 04", count: 24, category: "대외활동" },
  { id: 2, title: "안산 연희동 벽화 봉사", date: "2025. 03", count: 38, category: "봉사활동" },
  { id: 3, title: "OB/YB 연합 MT", date: "2025. 03", count: 56, category: "대내활동" },
  { id: 4, title: "신촌 무료급식소 봉사", date: "2025. 02", count: 19, category: "봉사활동" },
];

const photos = [
  { id: 1, album: "OB/YB 연합 MT", category: "대내활동", size: "large" },
  { id: 2, album: "안산 연희동 벽화 봉사", category: "봉사활동", size: "small" },
  { id: 3, album: "2025 대동제 봉사부스", category: "대외활동", size: "small" },
  { id: 4, album: "신촌 무료급식소 봉사", category: "봉사활동", size: "small" },
  { id: 5, album: "OB/YB 연합 MT", category: "대내활동", size: "medium" },
  { id: 6, album: "안산 연희동 벽화 봉사", category: "봉사활동", size: "small" },
  { id: 7, album: "2025 대동제 봉사부스", category: "대외활동", size: "large" },
  { id: 8, album: "신촌 무료급식소 봉사", category: "봉사활동", size: "small" },
  { id: 9, album: "OB/YB 연합 MT", category: "대내활동", size: "small" },
  { id: 10, album: "안산 연희동 벽화 봉사", category: "봉사활동", size: "medium" },
  { id: 11, album: "2025 대동제 봉사부스", category: "대외활동", size: "small" },
  { id: 12, album: "신촌 무료급식소 봉사", category: "봉사활동", size: "small" },
];

const categories = ["전체", "봉사활동", "대내활동", "대외활동", "버디활동", "기타"];

export default function GalleryPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"albums" | "all">("albums");
  const [activeCategory, setActiveCategory] = useState("전체");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredPhotos =
    activeCategory === "전체" ? photos : photos.filter((p) => p.category === activeCategory);

  return (
    <PageLayout>
      <PageHeader
        iconNode={<PhotoLibraryIcon />}
        title="사진첩"
        subtitle="로타랙트의 소중한 추억들을 사진으로 만나보세요."
      />

      {/* 탭 + 새 앨범 버튼 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {(["albums", "all"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                activeTab === tab
                  ? "bg-primary-container text-white"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {tab === "albums" ? "앨범별 보기" : "전체 사진"}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold bg-primary-container text-white hover:opacity-90 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-base">add</span>
          새 앨범
        </button>
      </div>

      {/* 앨범별 보기 */}
      {activeTab === "albums" && (
        albums.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-5">
            <div className="w-20 h-20 rounded-2xl bg-primary-fixed/30 flex items-center justify-center">
              <PhotoLibraryIcon className="w-10 h-10 text-primary-container/60" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-on-surface">아직 등록된 앨범이 없어요</p>
              <p className="text-sm text-on-surface-variant mt-1">첫 번째 앨범을 만들어 추억을 기록해보세요.</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-container text-white text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              새 앨범 만들기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album) => {
              const { color, accent } = CATEGORY_STYLES[album.category] ?? CATEGORY_DEFAULT;
              return (
              <div
                key={album.id}
                onClick={() => navigate(PATHS.GALLERY_ALBUM.replace(":id", String(album.id)))}
                className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-card hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group"
              >
                <div className={`h-52 ${color} relative flex items-center justify-center`}>
                  <div className="grid grid-cols-2 gap-2 p-4 w-full h-full">
                    {[0, 1, 2, 3].map((j) => (
                      <div
                        key={j}
                        className={`rounded-xl ${j === 0 ? color : "bg-white/20"} flex items-center justify-center`}
                      >
                        <span className="material-symbols-outlined text-2xl text-on-surface-variant/30">image</span>
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className={`text-xs font-bold ${accent} bg-white/80 px-2 py-0.5 rounded-full`}>
                      {album.category}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-headline font-bold text-on-surface group-hover:text-primary-container transition-colors">
                    {album.title}
                  </h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-on-surface-variant">{album.date}</span>
                    <span className="text-sm font-semibold text-primary-container">{album.count}장</span>
                  </div>
                </div>
              </div>
            );
            })}
          </div>
        )
      )}

      {/* 전체 사진 */}
      {activeTab === "all" && (
        photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-20 h-20 rounded-2xl bg-primary-fixed/30 flex items-center justify-center">
              <AddPhotoAlternateIcon className="w-10 h-10 text-primary-container/60" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-on-surface">등록된 사진이 없어요</p>
              <p className="text-sm text-on-surface-variant mt-1">앨범을 만들고 사진을 추가해보세요.</p>
            </div>
          </div>
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
              {filteredPhotos.map((photo, i) => {
                const { color } = CATEGORY_STYLES[photo.category] ?? CATEGORY_DEFAULT;
                return (
                  <div
                    key={photo.id}
                    onClick={() => setLightboxIndex(i)}
                    className={`break-inside-avoid relative rounded-xl overflow-hidden cursor-pointer group ${color} ${
                      photo.size === "large" ? "h-64" : photo.size === "medium" ? "h-48" : "h-36"
                    } flex items-center justify-center`}
                  >
                    <span className="material-symbols-outlined text-3xl text-on-surface-variant/30">image</span>
                    <div className="absolute inset-0 bg-primary/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <span className="material-symbols-outlined text-white text-3xl mb-1">zoom_in</span>
                      <p className="text-white text-xs font-semibold text-center px-2 leading-tight">{photo.album}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )
      )}

      {showCreateModal && <AlbumCreateModal onClose={() => setShowCreateModal(false)} />}

      {lightboxIndex !== null && (
        <Lightbox
          photos={filteredPhotos.map((p) => ({
            id: p.id,
            color: (CATEGORY_STYLES[p.category] ?? CATEGORY_DEFAULT).color,
          }))}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </PageLayout>
  );
}
