import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import {
  submitReport,
  fetchReports,
  resolveReport,
  revertReport,
} from "@/api/reports";

function alertError(action: string) {
  return (error: Error) => alert(`${action} 중 오류가 발생했습니다: ${error.message}`);
}

export const reportsQueryKey = (status: string, page: number) =>
  ["reports", status, page] as const;

function useInvalidateReports() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["reports"] });
}

export function useSubmitReport() {
  return useMutation({
    mutationFn: ({
      reporterId,
      title,
      content,
    }: {
      reporterId: string;
      title: string;
      content: string;
    }) => submitReport(reporterId, title, content),
  });
}

export function useReports(status: "pending" | "resolved", page: number) {
  return useQuery({
    queryKey: reportsQueryKey(status, page),
    queryFn: () => fetchReports(status, page),
    placeholderData: keepPreviousData,
  });
}

export function useResolveReport() {
  const invalidate = useInvalidateReports();
  return useMutation({
    mutationFn: resolveReport,
    onError: alertError("처리"),
    onSettled: invalidate,
  });
}

export function useRevertReport() {
  const invalidate = useInvalidateReports();
  return useMutation({
    mutationFn: revertReport,
    onError: alertError("되돌리기"),
    onSettled: invalidate,
  });
}
