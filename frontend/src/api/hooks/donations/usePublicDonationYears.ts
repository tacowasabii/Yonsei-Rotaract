import { useQuery } from "@tanstack/react-query";
import { fetchPublicDonationYears } from "../../donations";

export function usePublicDonationYears() {
  return useQuery({
    queryKey: ["public-donation-years"],
    queryFn: fetchPublicDonationYears,
  });
}
