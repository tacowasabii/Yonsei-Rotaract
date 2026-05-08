import { useQuery } from "@tanstack/react-query";
import { fetchAlbum } from "@/api/gallery";

export const albumQueryKey = (id: string) => ["albums", id] as const;

export function useAlbum(id: string) {
  return useQuery({
    queryKey: albumQueryKey(id),
    queryFn: () => fetchAlbum(id),
    enabled: !!id,
  });
}
