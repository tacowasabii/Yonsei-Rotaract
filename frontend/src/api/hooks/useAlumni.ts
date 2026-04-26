import { useQuery } from "@tanstack/react-query";
import { fetchAlumni } from "../profiles";
import type { AlumniMember } from "../types/member";

export function useAlumni() {
  return useQuery<AlumniMember[]>({
    queryKey: ["alumni"],
    queryFn: fetchAlumni,
  });
}
