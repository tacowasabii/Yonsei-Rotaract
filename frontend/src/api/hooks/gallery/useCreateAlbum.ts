import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAlbum, type CreateAlbumParams } from "@/api/gallery";
import { useAuth } from "@/contexts/AuthContext";
import { albumsQueryKey } from "./useAlbums";

export function useCreateAlbum() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateAlbumParams) => {
      if (!user) throw new Error("로그인이 필요합니다.");
      return createAlbum(user.id, params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: albumsQueryKey() });
    },
  });
}
