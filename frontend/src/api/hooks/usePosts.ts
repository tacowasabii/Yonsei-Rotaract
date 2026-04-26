import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "@/api/posts";

export function usePosts(boardType: "free" | "promo", page: number = 1) {
  return useQuery({
    queryKey: ["posts", boardType, page],
    queryFn: () => fetchPosts(boardType, page),
  });
}
