import { supabase } from "@/lib/supabase";
import type { Member, AlumniMember, PendingMember, RejectedMember, AppRole } from "./types/member";

function compressAvatar(file: File): Promise<Blob> {
  const MAX = 512;
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > MAX || height > MAX) {
        if (width > height) { height = Math.round((height * MAX) / width); width = MAX; }
        else { width = Math.round((width * MAX) / height); height = MAX; }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width; canvas.height = height;
      canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("압축 실패"))),
        "image/jpeg", 0.8
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("이미지 로드 실패")); };
    img.src = url;
  });
}

export async function uploadProfileImage(userId: string, file: File): Promise<string> {
  const blob = await compressAvatar(file);
  const path = `${userId}/${userId}.jpg`;
  const { error: uploadError } = await supabase.storage
    .from("profile-images")
    .upload(path, blob, { upsert: true, contentType: "image/jpeg" });
  if (uploadError) throw uploadError;
  const { data: { publicUrl } } = supabase.storage.from("profile-images").getPublicUrl(path);
  const urlWithTs = `${publicUrl}?t=${Date.now()}`;
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: urlWithTs })
    .eq("id", userId);
  if (updateError) throw updateError;
  return urlWithTs;
}

export async function deleteProfileImage(userId: string): Promise<void> {
  await supabase.storage.from("profile-images").remove([`${userId}/${userId}.jpg`]);
  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: null })
    .eq("id", userId);
  if (error) throw error;
}

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
    .select("id, name, email, phone, member_type, admission_year, department, generation, role, status, created_at, company, job_title, is_company_public, marketing_agree, avatar_url")
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

export async function fetchAlumni(): Promise<AlumniMember[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, email, admission_year, department, generation, company, job_title")
    .eq("member_type", "alumni")
    .eq("status", "active")
    .eq("is_company_public", true)
    .order("generation", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as AlumniMember[];
}

export async function verifyCurrentPassword(email: string, password: string): Promise<boolean> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return !error;
}

export async function updateMarketingAgree(userId: string, value: boolean): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update({ marketing_agree: value })
    .eq("id", userId);
  if (error) throw error;
}

export async function upsertProfile(profile: {
  id: string;
  name: string;
  email: string;
  phone: string;
  member_type: "current" | "alumni";
  admission_year: string | null;
  department: string | null;
  generation: string | null;
  role: string;
  status: string;
  marketing_agree?: boolean;
}): Promise<void> {
  const { error } = await supabase.from("profiles").upsert(profile);
  if (error) throw error;
}
