import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePost, type UpdatePostParams } from "@/api/posts";

export function useUpdatePost(boardType: "free" | "promo") {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, params }: { id: string; params: UpdatePostParams }) =>
      updatePost(id, params),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["posts", boardType] });
      queryClient.invalidateQueries({ queryKey: ["post", data.id] });
    },
  });
}
