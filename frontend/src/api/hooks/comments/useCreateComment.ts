import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { createComment } from "@/api/comments";

export function useCreateComment(postId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => {
      if (!user) throw new Error("로그인이 필요합니다.");
      return createComment(user.id, postId, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["anon_comments", postId] });
    },
  });
}
