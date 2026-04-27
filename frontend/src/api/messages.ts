import { supabase } from "@/lib/supabase";
import type { Message, MemberSearchResult } from "./types/message";

const MESSAGE_SELECT =
  "*, sender:profiles!messages_sender_id_fkey(name, department, admission_year, generation, role), recipient:profiles!messages_recipient_id_fkey(name, department, admission_year, generation, role)";

export async function fetchReceivedMessages(userId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from("messages")
    .select(MESSAGE_SELECT)
    .eq("recipient_id", userId)
    .eq("is_deleted_by_recipient", false)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Message[];
}

export async function fetchSentMessages(userId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from("messages")
    .select(MESSAGE_SELECT)
    .eq("sender_id", userId)
    .eq("is_deleted_by_sender", false)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Message[];
}

export async function fetchUnreadCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("recipient_id", userId)
    .is("read_at", null)
    .eq("is_deleted_by_recipient", false);
  if (error) throw error;
  return count ?? 0;
}

export async function sendMessage(
  senderId: string,
  recipientId: string,
  title: string,
  content: string
): Promise<void> {
  const { error } = await supabase.from("messages").insert({
    sender_id: senderId,
    recipient_id: recipientId,
    title,
    content,
  });
  if (error) throw error;
}

export async function markAsRead(messageId: string): Promise<void> {
  const { error } = await supabase
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("id", messageId)
    .is("read_at", null);
  if (error) throw error;
}

export async function deleteMessageBySender(messageId: string): Promise<void> {
  const { error } = await supabase
    .from("messages")
    .update({ is_deleted_by_sender: true })
    .eq("id", messageId);
  if (error) throw error;
}

export async function deleteMessageByRecipient(messageId: string): Promise<void> {
  const { error } = await supabase
    .from("messages")
    .update({ is_deleted_by_recipient: true })
    .eq("id", messageId);
  if (error) throw error;
}

const ROLE_SEARCH_MAP: Record<string, string> = { "운영진": "staff", "관리자": "admin" };

export async function searchMembers(query: string): Promise<MemberSearchResult[]> {
  if (!query.trim()) return [];
  const mappedRole = Object.entries(ROLE_SEARCH_MAP).find(([label]) =>
    label.startsWith(query.trim())
  )?.[1];
  let qb = supabase
    .from("profiles")
    .select("id, name, department, admission_year, generation, role")
    .eq("status", "active")
    .neq("role", "super_admin")
    .limit(10);
  if (mappedRole) {
    qb = qb.or(`name.ilike.%${query.trim()}%,role.eq.${mappedRole}`);
  } else {
    qb = qb.ilike("name", `%${query.trim()}%`);
  }
  const { data, error } = await qb;
  if (error) throw error;
  return (data ?? []) as MemberSearchResult[];
}
