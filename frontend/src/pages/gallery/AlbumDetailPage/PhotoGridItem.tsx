import type { AlbumPhoto } from "@/api/gallery";

interface Props {
  photo: AlbumPhoto;
  index: number;
  isSelected: boolean;
  selectMode: boolean;
  isLoggedIn: boolean;
  onClick: (id: string, index: number) => void;
}

export default function PhotoGridItem({ photo, index, isSelected, selectMode, isLoggedIn, onClick }: Props) {
  return (
    <div
      onClick={() => onClick(photo.id, index)}
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

      {isLoggedIn && selectMode && (
        <div className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
          isSelected ? "bg-primary-container border-primary-container" : "bg-white/80 border-white/80"
        }`}>
          {isSelected && <span className="material-symbols-outlined text-white text-sm">check</span>}
        </div>
      )}

      {isLoggedIn && selectMode && isSelected && (
        <div className="absolute inset-0 bg-primary-container/20" />
      )}
    </div>
  );
}
