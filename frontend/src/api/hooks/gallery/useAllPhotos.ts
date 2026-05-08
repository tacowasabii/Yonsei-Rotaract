import { useQuery } from "@tanstack/react-query";
import { fetchAllPhotos, type GalleryCategory } from "@/api/gallery";

export const allPhotosQueryKey = (category?: string) =>
  ["all_photos", category ?? "전체"] as const;

export function useAllPhotos(category?: GalleryCategory | "전체") {
  return useQuery({
    queryKey: allPhotosQueryKey(category),
    queryFn: () => fetchAllPhotos(category),
  });
}
