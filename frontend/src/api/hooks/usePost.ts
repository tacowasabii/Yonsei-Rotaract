import { useQuery } from "@tanstack/react-query";
import { fetchPost } from "@/api/posts";

export function usePost(id: string | undefined) {
  return useQuery({
    queryKey: ["post", id],
    queryFn: () => fetchPost(id!),
    enabled: !!id,
  });
}
