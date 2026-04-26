import { useEffect, useRef, useState } from "react";
import type {
  UseFormRegister,
  UseFormTrigger,
  FieldErrors,
} from "react-hook-form";
import type { SignupFormValues } from "../types";
import { inputClass, errorClass } from "./fieldStyles";
import { sendEmailOtp, verifyEmailOtpCode } from "@/api/auth";

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
  const [sending, setSending] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const otpInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    if (otpSent) otpInputRef.current?.focus();
  }, [otpSent]);

  const handleSendOtp = async () => {
    const valid = await trigger("email");
    if (!valid) return;
    setSendError(null);
    setSending(true);
    try {
      await sendEmailOtp(emailValue);
      setOtpSent(true);
      setOtp("");
      setVerifyError(null);
      setCooldown(30);
    } catch (err) {
      setSendError(err instanceof Error ? err.message : "발송에 실패했습니다.");
    } finally {
      setSending(false);
    }
  };

  const handleVerify = async () => {
    if (otp.length !== 6) return;
    setVerifyError(null);
    setVerifying(true);
    try {
      await verifyEmailOtpCode(emailValue, otp);
      onCheckedChange(true);
    } catch {
      setVerifyError("인증번호가 올바르지 않거나 만료되었습니다.");
      setOtp("");
      otpInputRef.current?.focus();
    } finally {
      setVerifying(false);
    }
  };

  const handleOtpChange = (value: string) => {
    if (!/^\d*$/.test(value) || value.length > 6) return;
    setOtp(value);
    setVerifyError(null);
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
            disabled={emailChecked === true || otpSent}
            className={`${inputClass(!!errors.email)} disabled:opacity-60`}
            {...register("email", {
              required: "이메일을 입력하세요.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "올바른 이메일 주소를 입력하세요.",
              },
              onChange: () => {
                onCheckedChange(null);
                setSendError(null);
                setOtpSent(false);
                setOtp("");
              },
            })}
          />
        </div>
        <button
          type="button"
          onClick={handleSendOtp}
          disabled={emailChecked === true || sending || cooldown > 0}
          className="px-4 h-11 bg-primary-fixed text-primary-container text-sm font-bold rounded-xl hover:bg-primary-fixed/70 transition-all shrink-0 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
        >
          {sending && (
            <span className="material-symbols-outlined text-sm animate-spin">
              progress_activity
            </span>
          )}
          {sending ? "발송 중..." : otpSent ? "재발송" : "인증번호 발송"}
        </button>
      </div>

      {errors.email && <p className={errorClass}>{errors.email.message}</p>}
      {sendError && <p className={errorClass}>{sendError}</p>}

      {/* OTP 입력 */}
      {otpSent && emailChecked !== true && (
        <div className="mt-2 space-y-2">
          <div className="flex gap-2">
            <input
              ref={otpInputRef}
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => handleOtpChange(e.target.value)}
              placeholder="인증번호 6자리"
              className="flex-1 px-4 py-2.5 bg-surface-container rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary-container/30 transition-all tracking-widest font-mono"
            />
            <button
              type="button"
              onClick={handleVerify}
              disabled={otp.length !== 6 || verifying}
              className="px-4 h-11 bg-primary-container text-white text-sm font-bold rounded-xl hover:opacity-90 transition-all shrink-0 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              {verifying && (
                <span className="material-symbols-outlined text-sm animate-spin">
                  progress_activity
                </span>
              )}
              {verifying ? "확인 중..." : "확인"}
            </button>
          </div>
          {verifyError && <p className={errorClass}>{verifyError}</p>}
          {cooldown > 0 && (
            <p className="text-xs text-on-surface-variant/60">
              재발송은 {cooldown}초 후 가능합니다.
            </p>
          )}
        </div>
      )}

      {emailChecked === true && (
        <p className="mt-2 text-xs text-primary-container flex items-center gap-1 font-semibold">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          이메일 인증이 완료되었습니다.
        </p>
      )}

      {submitAttempted && !errors.email && !sendError && emailChecked !== true && (
        <p className={errorClass}>이메일 인증을 완료해주세요.</p>
      )}
    </div>
  );
}
