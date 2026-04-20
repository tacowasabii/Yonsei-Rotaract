import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "@/api/posts";

export function usePosts(boardType: "free" | "promo") {
  return useQuery({
    queryKey: ["posts", boardType],
    queryFn: () => fetchPosts(boardType),
  });
}
