import { useState } from "react";
import { UseFormRegister, UseFormTrigger, FieldErrors } from "react-hook-form";
import { SignupFormValues } from "../types";

const inputClass = (hasError: boolean) =>
  `w-full pl-11 pr-4 py-3 bg-surface-container rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant outline-none transition-all ${
    hasError ? "ring-2 ring-error" : "focus:ring-2 focus:ring-primary-container/30"
  }`;

const errorClass = "mt-1 text-xs text-error";

type Props = {
  register: UseFormRegister<SignupFormValues>;
  trigger: UseFormTrigger<SignupFormValues>;
  errors: FieldErrors<SignupFormValues>;
  usernameChecked: boolean | null;
  onCheckedChange: (checked: boolean | null) => void;
  submitAttempted: boolean;
};

export function UsernameField({
  register,
  trigger,
  errors,
  usernameChecked,
  onCheckedChange,
  submitAttempted,
}: Props) {
  const [isChecking, setIsChecking] = useState(false);

  const handleCheck = async () => {
    const valid = await trigger("username");
    if (!valid) return;
    setIsChecking(true);
    // TODO: 실제 중복 확인 API 연동
    await new Promise((r) => setTimeout(r, 600));
    onCheckedChange(true);
    setIsChecking(false);
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-on-surface mb-1.5">아이디</label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
            person
          </span>
          <input
            type="text"
            placeholder="사용할 아이디를 입력하세요"
            disabled={usernameChecked === true}
            className={`${inputClass(!!errors.username)} disabled:opacity-60`}
            {...register("username", {
              required: "아이디를 입력하세요.",
              minLength: { value: 4, message: "4자 이상 입력하세요." },
              maxLength: { value: 20, message: "20자 이하로 입력하세요." },
              pattern: {
                value: /^[a-zA-Z0-9_]+$/,
                message: "영문, 숫자, 밑줄(_)만 사용 가능합니다.",
              },
              onChange: () => onCheckedChange(null),
            })}
          />
        </div>
        <button
          type="button"
          onClick={handleCheck}
          disabled={usernameChecked === true || isChecking}
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
      {errors.username && <p className={errorClass}>{errors.username.message}</p>}
      {usernameChecked === true && (
        <p className="mt-2 text-xs text-primary-container flex items-center gap-1 font-semibold">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          사용 가능한 아이디입니다.
        </p>
      )}
      {usernameChecked === false && (
        <p className={errorClass}>이미 사용 중인 아이디입니다.</p>
      )}
      {submitAttempted && !errors.username && usernameChecked !== true && usernameChecked !== false && (
        <p className={errorClass}>아이디 중복확인을 해주세요.</p>
      )}
    </div>
  );
}
