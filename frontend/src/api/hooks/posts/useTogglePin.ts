import { useMutation, useQueryClient } from "@tanstack/react-query";
import { togglePinPost } from "@/api/posts";

export function useTogglePin(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isPinned: boolean) => togglePinPost(postId, isPinned),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", "notice"] });
      queryClient.invalidateQueries({ queryKey: ["pinnedPosts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });
}
