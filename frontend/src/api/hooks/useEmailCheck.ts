import { useMutation } from "@tanstack/react-query";
import { checkEmailAvailable } from "../auth";

export function useEmailCheck() {
  return useMutation({
    mutationFn: (email: string) => checkEmailAvailable(email),
  });
}
