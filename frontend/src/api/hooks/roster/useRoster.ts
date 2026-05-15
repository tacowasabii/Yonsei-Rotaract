import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchRoster, insertRosterMembers, updateRosterMember, deleteRosterMember, deleteRosterByGeneration } from "../../roster";
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

export function useUpdateRoster() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RosterInsert> }) =>
      updateRosterMember(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rosterQueryKey });
    },
  });
}

export function useDeleteRoster() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteRosterMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rosterQueryKey });
    },
  });
}

export function useDeleteRosterByGeneration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (generation: string | null) => deleteRosterByGeneration(generation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rosterQueryKey });
    },
  });
}
