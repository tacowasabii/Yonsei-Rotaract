import { useQuery } from "@tanstack/react-query";
import { fetchMyPosts } from "@/api/posts";
import { useAuth } from "@/contexts/AuthContext";

export function useMyPosts() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["myPosts", user?.id],
    queryFn: () => fetchMyPosts(user!.id),
    enabled: !!user,
  });
}
