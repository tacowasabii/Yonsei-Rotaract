import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPostLiked, togglePostLike } from "@/api/posts";
import { useAuth } from "@/contexts/AuthContext";

export function usePostLike(postId: string | undefined) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: liked = false } = useQuery({
    queryKey: ["postLike", postId, user?.id],
    queryFn: () => fetchPostLiked(postId!, user!.id),
    enabled: !!postId && !!user,
  });

  const { mutate: toggle } = useMutation({
    mutationFn: () => togglePostLike(postId!, user!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["postLike", postId, user?.id] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });

  return { liked, toggle };
}
