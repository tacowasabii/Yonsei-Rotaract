import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost, type CreatePostParams } from "@/api/posts";
import { useAuth } from "@/contexts/AuthContext";

export function useCreatePost() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreatePostParams) => {
      if (!user) throw new Error("로그인이 필요합니다.");
      return createPost(user.id, params);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["posts", data.board_type] });
    },
  });
}
