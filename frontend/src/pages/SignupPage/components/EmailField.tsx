import { useState } from "react";
import type {
  UseFormRegister,
  UseFormTrigger,
  FieldErrors,
} from "react-hook-form";
import type { SignupFormValues } from "../types";
import { inputClass, errorClass } from "./fieldStyles";
import { supabase } from "@/lib/supabase";

type Props = {
  register: UseFormRegister<SignupFormValues>;
  trigger: UseFormTrigger<SignupFormValues>;
  errors: FieldErrors<SignupFormValues>;
  emailValue: string;
  emailChecked: boolean | null;
  onCheckedChange: (checked: boolean | null) => void;
  submitAttempted: boolean;
};

export function EmailField({
  register,
  trigger,
  errors,
  emailValue,
  emailChecked,
  onCheckedChange,
  submitAttempted,
}: Props) {
  const [isChecking, setIsChecking] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleCheck = async () => {
    const valid = await trigger("email");
    if (!valid) return;
    setIsChecking(true);
    setServerError(null);
    try {
      const { data, error } = await supabase.rpc("check_email_available", {
        email_to_check: emailValue,
      });
      if (error) throw error;
      onCheckedChange(data === true);
    } catch (err) {
      onCheckedChange(null);
      setServerError(err instanceof Error ? err.message : "서버 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-on-surface mb-1.5">
        이메일
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
            mail
          </span>
          <input
            type="email"
            placeholder="이메일 주소를 입력하세요"
            disabled={emailChecked === true}
            className={`${inputClass(!!errors.email)} disabled:opacity-60`}
            {...register("email", {
              required: "이메일을 입력하세요.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "올바른 이메일 주소를 입력하세요.",
              },
              onChange: () => { onCheckedChange(null); setServerError(null); },
            })}
          />
        </div>
        <button
          type="button"
          onClick={handleCheck}
          disabled={emailChecked === true || isChecking}
          className="px-4 py-3 bg-primary-fixed text-primary-container text-sm font-bold rounded-xl hover:bg-primary-fixed/70 transition-all shrink-0 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
        >
          {isChecking && (
            <span className="material-symbols-outlined text-sm animate-spin">
              progress_activity
            </span>
          )}
          {isChecking ? "확인 중..." : "중복확인"}
        </button>
      </div>
      {errors.email && (
        <p className={errorClass}>{errors.email.message}</p>
      )}
      {emailChecked === true && (
        <p className="mt-2 text-xs text-primary-container flex items-center gap-1 font-semibold">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          사용 가능한 이메일입니다.
        </p>
      )}
      {emailChecked === false && (
        <p className={errorClass}>이미 가입된 이메일입니다.</p>
      )}
      {serverError && (
        <p className={errorClass}>{serverError}</p>
      )}
      {submitAttempted &&
        !errors.email &&
        !serverError &&
        emailChecked !== true &&
        emailChecked !== false && (
          <p className={errorClass}>이메일 중복확인을 해주세요.</p>
        )}
    </div>
  );
}
