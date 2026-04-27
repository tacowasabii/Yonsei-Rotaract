import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment } from "@/api/comments";

export function useDeleteComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["anon_comments", postId] });
    },
  });
}
