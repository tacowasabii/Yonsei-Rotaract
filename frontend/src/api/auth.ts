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

export async function checkEmailAvailable(email: string): Promise<boolean> {
  const { data, error } = await supabase.rpc("check_email_available", {
    email_to_check: email,
  });
  if (error) throw error;
  return data === true;
}

export async function sendEmailOtp(email: string): Promise<void> {
  const available = await checkEmailAvailable(email);
  if (!available) throw new Error("이미 가입된 이메일입니다.");
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true },
  });
  if (error) throw error;
}

export async function verifyEmailOtpCode(email: string, token: string): Promise<void> {
  const { error } = await supabase.auth.verifyOtp({ email, token, type: "email" });
  if (error) throw error;
}
