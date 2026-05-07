import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  approveDonation,
  rejectDonation,
  deleteDonation,
  toggleDonationVisibility,
} from "../../donations";

function useInvalidateDonations() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["donations"] });
}

function alertError(action: string) {
  return (error: unknown) => {
    const msg = error instanceof Error ? error.message : String(error);
    alert(`${action} 실패: ${msg}`);
  };
}

export function useApproveDonation() {
  const invalidate = useInvalidateDonations();
  return useMutation({
    mutationFn: approveDonation,
    onError: alertError("승인"),
    onSettled: invalidate,
  });
}

export function useRejectDonation() {
  const invalidate = useInvalidateDonations();
  return useMutation({
    mutationFn: rejectDonation,
    onError: alertError("거절"),
    onSettled: invalidate,
  });
}

export function useDeleteDonation() {
  const invalidate = useInvalidateDonations();
  return useMutation({
    mutationFn: deleteDonation,
    onError: alertError("삭제"),
    onSettled: invalidate,
  });
}

export function useToggleDonationVisibility() {
  const invalidate = useInvalidateDonations();
  return useMutation({
    mutationFn: ({ id, isHidden }: { id: string; isHidden: boolean }) =>
      toggleDonationVisibility(id, isHidden),
    onError: alertError("공개 여부 변경"),
    onSettled: invalidate,
  });
}
