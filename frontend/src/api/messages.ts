import { supabase } from "@/lib/supabase";
import type { Message, MemberSearchResult } from "./types/message";

const MESSAGE_SELECT =
  "*, sender:profiles!messages_sender_id_fkey(name), recipient:profiles!messages_recipient_id_fkey(name)";

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

export async function searchMembers(query: string): Promise<MemberSearchResult[]> {
  if (!query.trim()) return [];
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, department, admission_year, generation")
    .eq("status", "active")
    .ilike("name", `%${query.trim()}%`)
    .limit(10);
  if (error) throw error;
  return (data ?? []) as MemberSearchResult[];
}
