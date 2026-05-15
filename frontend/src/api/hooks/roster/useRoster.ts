import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchRoster, insertRosterMembers } from "../../roster";
import type { RosterInsert } from "../../roster";

const rosterQueryKey = ["admin-roster"] as const;

export function useRoster() {
  return useQuery({
    queryKey: rosterQueryKey,
    queryFn: fetchRoster,
  });
}

export function useInsertRoster() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (members: RosterInsert[]) => insertRosterMembers(members),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rosterQueryKey });
    },
  });
}
