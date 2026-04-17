import { useMutation } from "@tanstack/react-query";
import { signUp, type SignupParams } from "../auth";
import { upsertProfile } from "../profiles";

export function useSignup() {
  return useMutation({
    mutationFn: async (params: SignupParams) => {
      const authData = await signUp(params);
      if (authData.user) {
        await upsertProfile({
          id: authData.user.id,
          name: params.name,
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
