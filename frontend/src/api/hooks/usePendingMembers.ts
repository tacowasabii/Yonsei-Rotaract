import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchPendingMembers,
  fetchRejectedMembers,
  approveMember,
  rejectMember,
  approveAllPendingMembers,
} from "../profiles";
import type { PendingMember } from "../types/member";
import { membersQueryKey } from "./useMembers";

export const rejectedQueryKey = ["admin-rejected"] as const;

export const pendingQueryKey = ["admin-pending"] as const;

export function usePendingMembers() {
  return useQuery({
    queryKey: pendingQueryKey,
    queryFn: fetchPendingMembers,
  });
}

export function useApproveMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: approveMember,
    onMutate: async (memberId) => {
      await queryClient.cancelQueries({ queryKey: pendingQueryKey });
      const previous = queryClient.getQueryData<PendingMember[]>(pendingQueryKey);
      queryClient.setQueryData<PendingMember[]>(pendingQueryKey, (old) =>
        old?.filter((m) => m.id !== memberId)
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(pendingQueryKey, context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: pendingQueryKey });
      queryClient.invalidateQueries({ queryKey: membersQueryKey });
    },
  });
}

export function useRejectMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rejectMember,
    onMutate: async (memberId) => {
      await queryClient.cancelQueries({ queryKey: pendingQueryKey });
      const previous = queryClient.getQueryData<PendingMember[]>(pendingQueryKey);
      queryClient.setQueryData<PendingMember[]>(pendingQueryKey, (old) =>
        old?.filter((m) => m.id !== memberId)
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(pendingQueryKey, context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: pendingQueryKey });
      queryClient.invalidateQueries({ queryKey: rejectedQueryKey });
    },
  });
}

export function useRejectedMembers() {
  return useQuery({
    queryKey: rejectedQueryKey,
    queryFn: fetchRejectedMembers,
  });
}

export function useApproveAllPending() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: approveAllPendingMembers,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: pendingQueryKey });
      const previous = queryClient.getQueryData<PendingMember[]>(pendingQueryKey);
      queryClient.setQueryData<PendingMember[]>(pendingQueryKey, []);
      return { previous };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(pendingQueryKey, context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: pendingQueryKey });
      queryClient.invalidateQueries({ queryKey: membersQueryKey });
    },
  });
}
