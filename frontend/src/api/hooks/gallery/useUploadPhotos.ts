import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadPhotos } from "@/api/gallery";
import { useAuth } from "@/contexts/AuthContext";
import { albumsQueryKey } from "./useAlbums";
import { albumPhotosQueryKey } from "./useAlbumPhotos";

export function useUploadPhotos(albumId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (files: File[]) => {
      if (!user) throw new Error("로그인이 필요합니다.");
      return uploadPhotos(albumId, user.id, files);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: albumPhotosQueryKey(albumId) });
      queryClient.invalidateQueries({ queryKey: albumsQueryKey() });
    },
  });
}
