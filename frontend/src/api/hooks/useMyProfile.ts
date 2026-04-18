import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMyFullProfile, updateMyPhone, updatePassword } from "../profiles";
import type { Member } from "../types/member";

export function useMyProfile(userId: string | undefined) {
  return useQuery<Member>({
    queryKey: ["my-profile", userId],
    queryFn: () => fetchMyFullProfile(userId!),
    enabled: !!userId,
  });
}

export function useUpdateMyPhone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, phone }: { userId: string; phone: string }) =>
      updateMyPhone(userId, phone),
    onSuccess: (_data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["my-profile", userId] });
    },
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: (newPassword: string) => updatePassword(newPassword),
  });
}
