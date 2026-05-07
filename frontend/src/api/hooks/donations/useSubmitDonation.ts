import { useMutation } from "@tanstack/react-query";
import { submitDonation } from "../../donations";
import type { SubmitDonationParams } from "../../types/donation";

export function useSubmitDonation() {
  return useMutation({
    mutationFn: ({ userId, params }: { userId: string; params: SubmitDonationParams }) =>
      submitDonation(userId, params),
  });
}
