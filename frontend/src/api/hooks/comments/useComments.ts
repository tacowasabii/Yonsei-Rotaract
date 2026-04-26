import { useQuery } from "@tanstack/react-query";
import { fetchComments } from "@/api/comments";

export function useComments(postId: string | undefined) {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId!),
    enabled: !!postId,
  });
}
