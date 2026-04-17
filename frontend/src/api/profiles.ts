import { supabase } from "@/lib/supabase";
import type { Member, AppRole } from "./types/member";

export async function fetchMembers(): Promise<Member[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, email, phone, member_type, admission_year, department, generation, role, status, created_at")
    .neq("status", "pending")
    .neq("role", "super_admin")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Member[];
}

export async function updateMemberRole(memberId: string, newRole: AppRole): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update({ role: newRole })
    .eq("id", memberId);
  if (error) throw error;
}

export async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, role, status, member_type")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data;
}

export async function upsertProfile(profile: {
  id: string;
  name: string;
  phone: string;
  member_type: "current" | "alumni";
  admission_year: string | null;
  department: string | null;
  generation: string | null;
  role: string;
  status: string;
}): Promise<void> {
  const { error } = await supabase.from("profiles").upsert(profile);
  if (error) throw error;
}
