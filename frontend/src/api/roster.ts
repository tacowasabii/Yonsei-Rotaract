import { supabase } from "@/lib/supabase";

export type RosterMember = {
  id: string;
  department: string;
  name: string;
  student_id: string;
  phone: string;
  generation: string;
  uploaded_by: string | null;
  created_at: string;
};

export type RosterInsert = Omit<RosterMember, "id" | "created_at">;

export async function fetchRoster(): Promise<RosterMember[]> {
  const { data, error } = await supabase
    .from("active_member_roster")
    .select("*")
    .order("generation", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function insertRosterMembers(members: RosterInsert[]): Promise<void> {
  const { error } = await supabase.from("active_member_roster").insert(members);
  if (error) throw error;
}

export async function updateRosterMember(id: string, data: Partial<RosterInsert>): Promise<void> {
  const { error } = await supabase.from("active_member_roster").update(data).eq("id", id);
  if (error) throw error;
}

export async function deleteRosterMember(id: string): Promise<void> {
  const { error } = await supabase.from("active_member_roster").delete().eq("id", id);
  if (error) throw error;
}

export async function deleteRosterByGeneration(generation: string | null): Promise<void> {
  const query = supabase.from("active_member_roster").delete();
  const { error } = await (generation ? query.eq("generation", generation) : query.not("id", "is", null));
  if (error) throw error;
}
