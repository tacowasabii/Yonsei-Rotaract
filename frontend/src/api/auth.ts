import { supabase } from "@/lib/supabase";

export interface SignupParams {
  email: string;
  password: string;
  name: string;
  phone: string;
  memberType: "current" | "alumni";
  admissionYear?: string;
  department?: string;
  generation?: string;
}

export async function signIn(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signUp(params: SignupParams) {
  const { data, error } = await supabase.auth.signUp({
    email: params.email,
    password: params.password,
    options: {
      data: {
        name: params.name,
        phone: params.phone,
        member_type: params.memberType,
        admission_year: params.memberType === "alumni" ? params.admissionYear ?? null : null,
        department: params.memberType === "alumni" ? params.department ?? null : null,
        generation: params.memberType === "alumni" ? params.generation ?? null : null,
      },
    },
  });
  if (error) throw error;
  return data;
}

export async function checkEmailAvailable(email: string): Promise<boolean> {
  const { data, error } = await supabase.rpc("check_email_available", {
    email_to_check: email,
  });
  if (error) throw error;
  return data === true;
}
