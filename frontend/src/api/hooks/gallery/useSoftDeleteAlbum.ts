import { useMutation, useQueryClient } from "@tanstack/react-query";
import { softDeleteAlbum } from "@/api/gallery";
import { albumsQueryKey } from "./useAlbums";

export function useSoftDeleteAlbum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (albumId: string) => softDeleteAlbum(albumId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: albumsQueryKey() });
    },
  });
}
