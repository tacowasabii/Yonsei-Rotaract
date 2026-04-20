import { supabase } from "@/lib/supabase";
import type { Member, PendingMember, RejectedMember, AppRole } from "./types/member";

export async function fetchMembers(): Promise<Member[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, email, phone, member_type, admission_year, department, generation, role, status, created_at")
    .neq("status", "pending")
    .neq("status", "rejected")
    .neq("role", "super_admin")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Member[];
}

export async function fetchRejectedMembers(): Promise<RejectedMember[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, email, phone, member_type, admission_year, department, generation, role, status, created_at")
    .eq("status", "rejected")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as RejectedMember[];
}

export async function updateMemberRole(memberId: string, newRole: AppRole): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update({ role: newRole })
    .eq("id", memberId);
  if (error) throw error;
}

export async function updateMemberStatus(memberId: string, newStatus: "active" | "inactive"): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update({ status: newStatus })
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

export async function fetchPendingMembers(): Promise<PendingMember[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, email, phone, member_type, admission_year, department, generation, role, status, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as PendingMember[];
}

export async function approveMember(memberId: string): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update({ status: "active" })
    .eq("id", memberId);
  if (error) throw error;
}

export async function rejectMember(memberId: string): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update({ status: "rejected" })
    .eq("id", memberId);
  if (error) throw error;
}

export async function approveAllPendingMembers(): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update({ status: "active" })
    .eq("status", "pending");
  if (error) throw error;
}

export async function fetchMyFullProfile(userId: string): Promise<Member> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, email, phone, member_type, admission_year, department, generation, role, status, created_at, company, job_title, is_company_public")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data as Member;
}

export async function updateMyCompanyInfo(userId: string, payload: {
  company: string;
  job_title: string;
  is_company_public: boolean;
}): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update(payload)
    .eq("id", userId);
  if (error) throw error;
}

export async function updateMyMemberType(userId: string, memberType: "current" | "alumni"): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update({ member_type: memberType })
    .eq("id", userId);
  if (error) throw error;
}

export async function updateMyPhone(userId: string, phone: string): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update({ phone })
    .eq("id", userId);
  if (error) throw error;
}

export async function updatePassword(newPassword: string): Promise<void> {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
}

export async function verifyCurrentPassword(email: string, password: string): Promise<boolean> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return !error;
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
