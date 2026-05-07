import { useQuery } from "@tanstack/react-query";
import { fetchPublicDonations } from "../../donations";

export const publicDonationsQueryKey = (year?: number) =>
  ["public-donations", year] as const;

export function usePublicDonations(year?: number) {
  return useQuery({
    queryKey: publicDonationsQueryKey(year),
    queryFn: () => fetchPublicDonations(year),
  });
}
