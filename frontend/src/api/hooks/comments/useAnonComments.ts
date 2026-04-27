import { useQuery } from "@tanstack/react-query";
import { fetchAnonComments } from "@/api/comments";

export function useAnonComments(postId?: string) {
  return useQuery({
    queryKey: ["anon_comments", postId],
    queryFn: () => fetchAnonComments(postId!),
    enabled: !!postId,
  });
}
