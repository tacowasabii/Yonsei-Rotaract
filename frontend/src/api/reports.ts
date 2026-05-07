import { supabase } from "@/lib/supabase";

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
