import { useQuery } from "@tanstack/react-query";
import { fetchNoticePosts } from "@/api/posts";

export function useNoticePosts(boardType: "free" | "promo" | "anon") {
  return useQuery({
    queryKey: ["noticePosts", boardType],
    queryFn: () => fetchNoticePosts(boardType),
  });
}
