import { useMutation } from "@tanstack/react-query";
import { submitReport } from "@/api/reports";

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
