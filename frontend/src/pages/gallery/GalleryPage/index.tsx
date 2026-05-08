import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@components/layout/PageLayout";
import PageHeader from "@components/layout/PageHeader";
import Lightbox from "@components/common/Lightbox";
import { PhotoLibraryIcon, AddPhotoAlternateIcon, SpinnerIcon, AddIcon } from "@assets/icons";
import { PATHS } from "@/routes/paths";
import { CATEGORY_STYLES, CATEGORY_DEFAULT } from "@/constants/gallery";
import { useIsStaff, useIsLoggedIn } from "@/contexts/AuthContext";
import { useAlbums } from "@/api/hooks/gallery/useAlbums";
import { useAllPhotos } from "@/api/hooks/gallery/useAllPhotos";
import type { GalleryCategory } from "@/api/gallery";
import AlbumCreateModal from "./AlbumCreateModal";

const categories = ["전체", "봉사활동", "대내활동", "대외활동", "버디활동", "기타"] as const;

export default function GalleryPage() {
  const navigate = useNavigate();
  const isLoggedIn = useIsLoggedIn();
  const isStaff = useIsStaff();
  const [activeTab, setActiveTab] = useState<"albums" | "all">("albums");
  const [activeCategory, setActiveCategory] = useState<GalleryCategory | "전체">("전체");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { data: albums = [], isLoading: albumsLoading } = useAlbums();
  const { data: allPhotos = [], isLoading: photosLoading } = useAllPhotos(
    activeTab === "all" ? activeCategory : undefined
  );

  const filteredPhotos = activeCategory === "전체"
    ? allPhotos
    : allPhotos.filter((p) => p.category === activeCategory);

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
              onClick={() => {
                if (tab === "all" && !isLoggedIn) { navigate(PATHS.LOGIN); return; }
                setActiveTab(tab);
              }}
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
        {isStaff && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold bg-primary-container text-white hover:opacity-90 active:scale-95 transition-all"
          >
            <AddIcon className="w-4 h-4" />
            새 앨범
          </button>
        )}
      </div>

      {/* 앨범별 보기 */}
      {activeTab === "albums" && (
        albumsLoading ? (
          <div className="flex justify-center py-24">
            <SpinnerIcon className="w-8 h-8 animate-spin" />
          </div>
        ) : albums.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-5">
            <div className="w-20 h-20 rounded-2xl bg-primary-fixed/30 flex items-center justify-center">
              <PhotoLibraryIcon className="w-10 h-10 text-primary-container/60" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-on-surface">아직 등록된 앨범이 없어요</p>
              <p className="text-sm text-on-surface-variant mt-1">첫 번째 앨범을 만들어 추억을 기록해보세요.</p>
            </div>
            {isStaff && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-container text-white text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
              >
                <AddIcon className="w-5 h-5" />
                새 앨범 만들기
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album) => {
              const { color, accent } = CATEGORY_STYLES[album.category] ?? CATEGORY_DEFAULT;
              const [y, m] = album.date.split("-");
              const dateLabel = `${y}. ${parseInt(m)}.`;
              return (
                <div
                  key={album.id}
                  onClick={() => {
                    if (!isLoggedIn) { navigate(PATHS.LOGIN); return; }
                    navigate(PATHS.GALLERY_ALBUM.replace(":id", album.id));
                  }}
                  className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-card hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group"
                >
                  <div className={`h-52 ${color} relative flex items-center justify-center`}>
                    {(() => {
                      const urls = album.cover_urls;
                      const n = urls.length;
                      const itemClass = (i: number) => {
                        if (n <= 1) return "col-span-2 row-span-2";
                        if (n === 2) return "row-span-2";
                        if (n === 3 && i === 2) return "col-span-2";
                        return "";
                      };
                      const slots: (string | null)[] = n === 0 ? [null] : urls.slice(0, 4);
                      return (
                        <div className="grid grid-cols-2 grid-rows-2 gap-2 p-4 w-full h-full">
                          {slots.map((url, j) => (
                            <div
                              key={j}
                              className={`rounded-xl overflow-hidden ${itemClass(j)} ${!url ? "bg-white/20 flex items-center justify-center" : ""}`}
                            >
                              {url ? (
                                <img src={url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <span className="material-symbols-outlined text-2xl text-on-surface-variant/30">image</span>
                              )}
                            </div>
                          ))}
                        </div>
                      );
                    })()}

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
                      <span className="text-sm text-on-surface-variant">{dateLabel}</span>
                      <span className="text-sm font-semibold text-primary-container">{album.photo_count}장</span>
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

          {photosLoading ? (
            <div className="flex justify-center py-24">
              <SpinnerIcon className="w-8 h-8 animate-spin" />
            </div>
          ) : filteredPhotos.length === 0 ? (
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
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {filteredPhotos.map((photo, i) => (
                <div
                  key={photo.id}
                  onClick={() => setLightboxIndex(i)}
                  className="break-inside-avoid relative rounded-xl overflow-hidden cursor-pointer group"
                >
                  <img src={photo.url} alt={photo.album_title} className="w-full h-auto" />
                  <div className="absolute inset-0 bg-primary/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="material-symbols-outlined text-white text-3xl mb-1">zoom_in</span>
                    <p className="text-white text-xs font-semibold text-center px-2 leading-tight">{photo.album_title}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {showCreateModal && <AlbumCreateModal onClose={() => setShowCreateModal(false)} />}

      {lightboxIndex !== null && (
        <Lightbox
          photos={filteredPhotos.map((p) => ({ id: p.id, url: p.url }))}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </PageLayout>
  );
}
