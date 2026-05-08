import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAlbum } from "@/api/gallery";
import { albumsQueryKey } from "./useAlbums";

export function useSoftDeleteAlbum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (albumId: string) => deleteAlbum(albumId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: albumsQueryKey() });
    },
  });
}
