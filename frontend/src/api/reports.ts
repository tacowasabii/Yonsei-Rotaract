import { supabase } from "@/lib/supabase";

export interface ReportRow {
  id: string;
  reporter_id: string;
  title: string;
  content: string;
  status: "pending" | "resolved";
  created_at: string;
  profiles: { name: string } | null;
}

const PAGE_SIZE = 15;

export async function submitReport(
  reporterId: string,
  title: string,
  content: string
): Promise<void> {
  const { error } = await supabase
    .from("reports")
    .insert({ reporter_id: reporterId, title, content });
  if (error) throw error;
}

export async function fetchReports(
  status: "pending" | "resolved",
  page: number
): Promise<{ data: ReportRow[]; count: number }> {
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const { data, error, count } = await supabase
    .from("reports")
    .select("*, profiles(name)", { count: "exact" })
    .eq("status", status)
    .order("created_at", { ascending: false })
    .range(from, to);
  if (error) throw error;
  return { data: (data ?? []) as ReportRow[], count: count ?? 0 };
}

export async function resolveReport(id: string): Promise<void> {
  const { data, error } = await supabase
    .from("reports")
    .update({ status: "resolved" })
    .eq("id", id)
    .select("id");
  if (error) throw error;
  if (!data || data.length === 0)
    throw new Error("처리 권한이 없거나 대상을 찾을 수 없습니다.");
}

export async function revertReport(id: string): Promise<void> {
  const { data, error } = await supabase
    .from("reports")
    .update({ status: "pending" })
    .eq("id", id)
    .select("id");
  if (error) throw error;
  if (!data || data.length === 0)
    throw new Error("처리 권한이 없거나 대상을 찾을 수 없습니다.");
}
