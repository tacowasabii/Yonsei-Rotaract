import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchPosts } from "@/api/posts";

export function usePosts(boardType: "free" | "promo" | "anon" | "notice", page: number = 1, search: string = "", pageSize?: number) {
  return useQuery({
    queryKey: ["posts", boardType, page, search, pageSize],
    queryFn: () => fetchPosts(boardType, page, search, pageSize),
    placeholderData: keepPreviousData,
  });
}
