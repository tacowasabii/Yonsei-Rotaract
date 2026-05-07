import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchDonations } from "../../donations";
import type { DonationStatus } from "../../types/donation";

export const donationsQueryKey = (status: DonationStatus, page: number) =>
  ["donations", status, page] as const;

const PAGE_SIZE = 15;

export function useDonations(status: DonationStatus, page: number) {
  return useQuery({
    queryKey: donationsQueryKey(status, page),
    queryFn: () => fetchDonations(status, page, PAGE_SIZE),
    placeholderData: keepPreviousData,
  });
}
