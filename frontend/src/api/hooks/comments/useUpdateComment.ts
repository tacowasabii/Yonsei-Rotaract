import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateComment } from "@/api/comments";

export function useUpdateComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      updateComment(id, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["anon_comments", postId] });
    },
  });
}
