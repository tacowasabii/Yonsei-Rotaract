import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchMyPosts } from "@/api/posts";
import { useAuth } from "@/contexts/AuthContext";

export function useMyPosts(boardType: "all" | "free" | "promo" = "all", page: number = 1) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["myPosts", user?.id, boardType, page],
    queryFn: () => fetchMyPosts(user!.id, boardType, page),
    enabled: !!user,
    placeholderData: keepPreviousData,
  });
}
