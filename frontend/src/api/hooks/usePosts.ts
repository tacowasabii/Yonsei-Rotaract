import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchPosts } from "@/api/posts";

export function usePosts(boardType: "free" | "promo", page: number = 1, search: string = "") {
  return useQuery({
    queryKey: ["posts", boardType, page, search],
    queryFn: () => fetchPosts(boardType, page, search),
    placeholderData: keepPreviousData,
  });
}
