import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMembers, updateMemberRole } from "../profiles";
import type { Member, AppRole } from "../types/member";

export const membersQueryKey = ["admin-members"] as const;

export function useMembers() {
  return useQuery({
    queryKey: membersQueryKey,
    queryFn: fetchMembers,
  });
}

export function useUpdateMemberRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ memberId, newRole }: { memberId: string; newRole: AppRole }) =>
      updateMemberRole(memberId, newRole),
    onMutate: async ({ memberId, newRole }) => {
      await queryClient.cancelQueries({ queryKey: membersQueryKey });
      const previous = queryClient.getQueryData<Member[]>(membersQueryKey);
      queryClient.setQueryData<Member[]>(membersQueryKey, (old) =>
        old?.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(membersQueryKey, context?.previous);
    },
  });
}
