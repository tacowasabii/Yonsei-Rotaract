import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { type SignupParams } from "../auth";
import { upsertProfile } from "../profiles";

export function useSignup() {
  return useMutation({
    mutationFn: async (params: SignupParams) => {
      const { data, error } = await supabase.auth.updateUser({
        password: params.password,
        data: {
          name: params.name,
          phone: params.phone,
          member_type: params.memberType,
          admission_year: params.memberType === "alumni" ? params.admissionYear ?? null : null,
          department: params.memberType === "alumni" ? params.department ?? null : null,
          generation: params.memberType === "alumni" ? params.generation ?? null : null,
        },
      });
      if (error && (error as { code?: string }).code !== "same_password") throw error;
      const user = data.user ?? (await supabase.auth.getUser()).data.user;
      if (user) {
        await upsertProfile({
          id: user.id,
          name: params.name,
          email: params.email,
          phone: params.phone,
          member_type: params.memberType,
          admission_year: params.memberType === "alumni" ? params.admissionYear ?? null : null,
          department: params.memberType === "alumni" ? params.department ?? null : null,
          generation: params.memberType === "alumni" ? params.generation ?? null : null,
          role: "user",
          status: "pending",
        });
      }
    },
  });
}
