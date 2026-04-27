import { supabase } from "@/lib/supabase";

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  profiles: { name: string } | null;
}

export interface AnonComment {
  id: string;
  post_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  anon_label: string;
  is_mine: boolean;
  can_delete: boolean;
}

export async function fetchAnonComments(postId: string): Promise<AnonComment[]> {
  const { data, error } = await supabase.rpc("get_anon_comments", { p_post_id: postId });
  if (error) throw error;
  return (data ?? []) as AnonComment[];
}

export async function fetchComments(postId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from("comments")
    .select("*, profiles(name)")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Comment[];
}

export async function createComment(
  authorId: string,
  postId: string,
  content: string
): Promise<Comment> {
  const { data, error } = await supabase
    .from("comments")
    .insert({ post_id: postId, author_id: authorId, content })
    .select("*, profiles(name)")
    .single();

  if (error) throw error;
  return data as Comment;
}

export async function updateComment(id: string, content: string): Promise<Comment> {
  const { data, error } = await supabase
    .from("comments")
    .update({ content })
    .eq("id", id)
    .select("*, profiles(name)")
    .single();

  if (error) throw error;
  return data as Comment;
}

export async function deleteComment(id: string): Promise<void> {
  const { error } = await supabase.from("comments").delete().eq("id", id);
  if (error) throw error;
}
