import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "@/api/posts";

export function useDeletePost(boardType: "free" | "promo") {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", boardType] });
    },
  });
}
