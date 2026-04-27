import { useQuery } from "@tanstack/react-query";
import { fetchAnonPost } from "@/api/posts";

export function useAnonPost(id?: string) {
  return useQuery({
    queryKey: ["anon_post", id],
    queryFn: () => fetchAnonPost(id!),
    enabled: !!id,
  });
}
