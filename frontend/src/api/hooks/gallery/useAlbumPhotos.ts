import { useQuery } from "@tanstack/react-query";
import { fetchPhotosByAlbum } from "@/api/gallery";

export const albumPhotosQueryKey = (albumId: string) =>
  ["album_photos", albumId] as const;

export function useAlbumPhotos(albumId: string) {
  return useQuery({
    queryKey: albumPhotosQueryKey(albumId),
    queryFn: () => fetchPhotosByAlbum(albumId),
    enabled: !!albumId,
  });
}
