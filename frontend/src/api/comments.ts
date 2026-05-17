import { supabase } from "@/lib/supabase";

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  parent_id: string | null;
  content: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  profiles: { name: string; avatar_url: string | null } | null;
}

export interface AnonComment {
  id: string;
  post_id: string;
  parent_id: string | null;
  content: string;
  created_at: string;
  updated_at: string;
  anon_label: string;
  is_mine: boolean;
  can_delete: boolean;
  is_deleted: boolean;
}

export async function fetchAnonComments(postId: string): Promise<AnonComment[]> {
  const { data, error } = await supabase.rpc("get_anon_comments", { p_post_id: postId });
  if (error) throw error;
  return (data ?? []) as AnonComment[];
}

export async function fetchComments(postId: string): Promise<Comment[]> {
  const { data, error } = await supabase.rpc("get_comments", { p_post_id: postId });
  if (error) throw error;
  return ((data ?? []) as Array<{
    id: string; post_id: string; author_id: string; parent_id: string | null;
    content: string; created_at: string; updated_at: string; is_deleted: boolean;
    author_name: string | null; author_avatar: string | null;
  }>).map((row) => ({
    id: row.id,
    post_id: row.post_id,
    author_id: row.author_id,
    parent_id: row.parent_id,
    content: row.content,
    created_at: row.created_at,
    updated_at: row.updated_at,
    is_deleted: row.is_deleted,
    profiles: { name: row.author_name ?? "알 수 없음", avatar_url: row.author_avatar },
  }));
}

export async function createComment(
  authorId: string,
  postId: string,
  content: string,
  parentId?: string
): Promise<Comment> {
  const { data, error } = await supabase
    .from("comments")
    .insert({ post_id: postId, author_id: authorId, content, parent_id: parentId ?? null })
    .select("*, profiles(name, avatar_url)")
    .single();

  if (error) throw error;
  const row = data as any;
  return {
    id: row.id,
    post_id: row.post_id,
    author_id: row.author_id,
    parent_id: row.parent_id ?? null,
    content: row.content,
    created_at: row.created_at,
    updated_at: row.updated_at,
    is_deleted: row.is_deleted ?? false,
    profiles: row.profiles ?? null,
  };
}

export async function updateComment(id: string, content: string): Promise<Comment> {
  const { data, error } = await supabase
    .from("comments")
    .update({ content })
    .eq("id", id)
    .select("*, profiles(name, avatar_url)")
    .single();

  if (error) throw error;
  const row = data as any;
  return {
    id: row.id,
    post_id: row.post_id,
    author_id: row.author_id,
    parent_id: row.parent_id ?? null,
    content: row.content,
    created_at: row.created_at,
    updated_at: row.updated_at,
    is_deleted: row.is_deleted ?? false,
    profiles: row.profiles ?? null,
  };
}

export async function deleteComment(id: string): Promise<void> {
  const { error } = await supabase
    .from("comments")
    .update({ is_deleted: true, deleted_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}
