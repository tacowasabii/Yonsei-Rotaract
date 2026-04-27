import { useQuery } from "@tanstack/react-query";
import { fetchPinnedPosts } from "@/api/posts";

export function usePinnedPosts() {
  return useQuery({
    queryKey: ["pinnedPosts"],
    queryFn: fetchPinnedPosts,
  });
}
