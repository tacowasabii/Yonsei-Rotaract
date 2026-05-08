import { useQuery } from "@tanstack/react-query";
import { fetchAlbums } from "@/api/gallery";

export const albumsQueryKey = () => ["albums"] as const;

export function useAlbums() {
  return useQuery({
    queryKey: albumsQueryKey(),
    queryFn: fetchAlbums,
  });
}
