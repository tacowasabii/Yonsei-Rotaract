import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePhotos } from "@/api/gallery";
import { albumsQueryKey } from "./useAlbums";
import { albumPhotosQueryKey } from "./useAlbumPhotos";

export function useDeletePhotos(albumId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (photos: Array<{ id: string; storage_path: string }>) =>
      deletePhotos(photos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: albumPhotosQueryKey(albumId) });
      queryClient.invalidateQueries({ queryKey: albumsQueryKey() });
    },
  });
}
