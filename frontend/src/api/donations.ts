import { supabase } from "@/lib/supabase";
import type { DonationRecord, PublicDonation, SubmitDonationParams } from "./types/donation";

const PROFILE_FIELDS = "profiles(name, department, admission_year, generation)";

export async function fetchDonations(
  status: "pending" | "approved" | "rejected",
  page: number,
  pageSize: number
): Promise<{ data: DonationRecord[]; total: number }> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("donations")
    .select(`id, created_at, approved_at, is_anonymous, message, status, is_hidden, ${PROFILE_FIELDS}`, { count: "exact" })
    .eq("status", status)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { data: (data ?? []) as DonationRecord[], total: count ?? 0 };
}

export async function fetchPublicDonations(year?: number): Promise<PublicDonation[]> {
  let query = supabase
    .from("donations")
    .select(`id, approved_at, is_anonymous, message, ${PROFILE_FIELDS}`)
    .eq("status", "approved")
    .eq("is_hidden", false)
    .order("approved_at", { ascending: false });

  if (year) {
    query = query
      .gte("approved_at", `${year}-01-01T00:00:00Z`)
      .lt("approved_at", `${year + 1}-01-01T00:00:00Z`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as PublicDonation[];
}

export async function fetchPublicDonationYears(): Promise<number[]> {
  const { data, error } = await supabase
    .from("donations")
    .select("approved_at")
    .eq("status", "approved")
    .eq("is_hidden", false)
    .not("approved_at", "is", null);

  if (error) throw error;
  const years = Array.from(
    new Set((data ?? []).map((d) => new Date(d.approved_at).getFullYear()))
  ).sort((a, b) => b - a);
  return years;
}

export async function submitDonation(
  userId: string,
  params: SubmitDonationParams
): Promise<void> {
  const { error } = await supabase.from("donations").insert({
    user_id: userId,
    is_anonymous: params.isAnonymous,
    message: params.message?.trim() || null,
    status: "pending",
  });
  if (error) throw error;
}

export async function approveDonation(id: string): Promise<void> {
  const { data, error } = await supabase
    .from("donations")
    .update({ status: "approved", approved_at: new Date().toISOString() })
    .eq("id", id)
    .select("id");
  if (error) throw error;
  if (!data || data.length === 0) throw new Error("승인 권한이 없거나 대상을 찾을 수 없습니다.");
}

export async function rejectDonation(id: string): Promise<void> {
  const { data, error } = await supabase
    .from("donations")
    .update({ status: "rejected" })
    .eq("id", id)
    .select("id");
  if (error) throw error;
  if (!data || data.length === 0) throw new Error("거절 권한이 없거나 대상을 찾을 수 없습니다.");
}

export async function toggleDonationVisibility(
  id: string,
  isHidden: boolean
): Promise<void> {
  const { data, error } = await supabase
    .from("donations")
    .update({ is_hidden: isHidden })
    .eq("id", id)
    .select("id");
  if (error) throw error;
  if (!data || data.length === 0) throw new Error("수정 권한이 없거나 대상을 찾을 수 없습니다.");
}

export async function deleteDonation(id: string): Promise<void> {
  const { error } = await supabase.from("donations").delete().eq("id", id);
  if (error) throw error;
}
