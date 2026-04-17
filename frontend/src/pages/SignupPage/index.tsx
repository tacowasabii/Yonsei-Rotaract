import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { useSignup } from "@/api/hooks/useSignup";
import { PATHS } from "@/routes/paths";
import type { SignupFormValues } from "./types";
import { EmailField } from "./components/EmailField";
import { PasswordField } from "./components/PasswordField";
import { FormInput } from "./components/FormInput";
import { MemberTypeSelector } from "./components/MemberTypeSelector";
import { GenerationDropdown } from "./components/GenerationDropdown";
import { AgreementsSection } from "./components/AgreementsSection";

export default function SignupPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    getValues,
    trigger,
    setValue,
    control,
    formState: { errors },
  } = useForm<SignupFormValues>({ mode: "onBlur" });

  const [memberType, setMemberType] = useState<"current" | "alumni">("current");
  const [agreedAll, setAgreedAll] = useState(false);
  const [agreements, setAgreements] = useState({ terms: false, privacy: false, optional: false });
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [emailChecked, setEmailChecked] = useState<boolean | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const signupMutation = useSignup();

  const handleAgreedAll = (checked: boolean) => {
    setAgreedAll(checked);
    setAgreements({ terms: checked, privacy: checked, optional: checked });
  };

  const handleAgreement = (key: keyof typeof agreements, checked: boolean) => {
    const next = { ...agreements, [key]: checked };
    setAgreements(next);
    setAgreedAll(Object.values(next).every(Boolean));
  };

  const onSubmit = (data: SignupFormValues) => {
    setSubmitAttempted(true);
    if (!emailChecked || !agreements.terms || !agreements.privacy) return;
    setSubmitError(null);
    signupMutation.mutate(
      {
        email: data.email,
        password: data.password,
        name: data.name,
        phone: data.phone,
        memberType,
        admissionYear: data.admissionYear,
        department: data.department,
        generation: data.generation,
      },
      {
        onSuccess: () => navigate(PATHS.SIGNUP_COMPLETE),
        onError: (error: unknown) => {
          setSubmitError(error instanceof Error ? error.message : "오류가 발생했습니다.");
        },
      }
    );
  };

  const handleSubmitClick = () => {
    setSubmitAttempted(true);
    trigger();
  };

  const [email, password, passwordConfirm, name, phone, admissionYear, department, generation] = useWatch({
    control,
    name: ["email", "password", "passwordConfirm", "name", "phone", "admissionYear", "department", "generation"],
  });

  const canSubmit = (() => {
    const base =
      emailChecked === true &&
      !!email &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
      !!password &&
      password.length >= 8 &&
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(password) &&
      !!passwordConfirm &&
      passwordConfirm === password &&
      !!name &&
      !!phone &&
      /^01[0-9]-?\d{3,4}-?\d{4}$/.test(phone) &&
      agreements.terms &&
      agreements.privacy;
    if (memberType === "alumni") return base && !!admissionYear && !!department && !!generation;
    return base;
  })();

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.png" alt="연세 로타랙트 로고" className="h-14 w-14 object-contain mb-3" />
          <h1 className="text-2xl font-extrabold font-headline text-primary-container">회원가입</h1>
          <p className="text-sm text-on-surface-variant mt-1">연세 로타랙트 커뮤니티에 함께하세요</p>
        </div>

        <div className="bg-surface-container-lowest rounded-3xl shadow-card p-8">
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <EmailField
              register={register}
              trigger={trigger}
              errors={errors}
              emailValue={email ?? ""}
              emailChecked={emailChecked}
              onCheckedChange={setEmailChecked}
              submitAttempted={submitAttempted}
            />

            <PasswordField
              label="비밀번호"
              placeholder="영문, 숫자, 특수문자 포함 8자 이상"
              hasError={!!errors.password}
              errorMessage={errors.password?.message}
              inputProps={register("password", {
                required: "비밀번호를 입력하세요.",
                minLength: { value: 8, message: "8자 이상 입력하세요." },
                pattern: {
                  value: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
                  message: "영문, 숫자, 특수문자를 포함해야 합니다.",
                },
              })}
            />

            <PasswordField
              label="비밀번호 확인"
              placeholder="비밀번호를 다시 입력하세요"
              hasError={!!errors.passwordConfirm}
              errorMessage={errors.passwordConfirm?.message}
              inputProps={register("passwordConfirm", {
                required: "비밀번호 확인을 입력하세요.",
                validate: (v) => v === getValues("password") || "비밀번호가 일치하지 않습니다.",
              })}
            />

            <FormInput
              label="이름"
              icon="badge"
              placeholder="실명을 입력하세요"
              hasError={!!errors.name}
              errorMessage={errors.name?.message}
              inputProps={register("name", { required: "이름을 입력하세요." })}
            />

            <FormInput
              label="휴대폰 번호"
              icon="smartphone"
              type="number"
              placeholder="01012345678"
              hasError={!!errors.phone}
              errorMessage={errors.phone?.message}
              inputProps={register("phone", {
                required: "휴대폰 번호를 입력하세요.",
                pattern: {
                  value: /^01[0-9]\d{7,8}$/,
                  message: "올바른 휴대폰 번호를 입력하세요.",
                },
              })}
            />

            <MemberTypeSelector memberType={memberType} onChange={setMemberType} />

            {memberType === "alumni" && (
              <>
                <FormInput
                  label="입학년도"
                  icon="tag"
                  type="number"
                  placeholder="예) 2018"
                  hasError={!!errors.admissionYear}
                  errorMessage={errors.admissionYear?.message}
                  inputProps={register("admissionYear", {
                    required: "입학년도를 입력하세요.",
                    pattern: { value: /^\d{4}$/, message: "4자리 연도를 입력하세요." },
                  })}
                />

                <FormInput
                  label="학과"
                  icon="menu_book"
                  placeholder="예) 경영학과"
                  hasError={!!errors.department}
                  errorMessage={errors.department?.message}
                  inputProps={register("department", { required: "학과를 입력하세요." })}
                />

                <GenerationDropdown
                  register={register}
                  setValue={setValue}
                  error={errors.generation}
                />

                <FormInput
                  label="현재 직장/직군 (선택)"
                  icon="business"
                  placeholder="예) 삼성전자 마케팅"
                  hasError={false}
                  inputProps={register("workplace")}
                />
              </>
            )}

            <AgreementsSection
              agreements={agreements}
              agreedAll={agreedAll}
              onAll={handleAgreedAll}
              onSingle={handleAgreement}
              submitAttempted={submitAttempted}
            />

            {submitError && (
              <p className="text-xs text-error text-center">{submitError}</p>
            )}

            <button
              type="submit"
              onClick={handleSubmitClick}
              disabled={signupMutation.isPending}
              className={`w-full py-3.5 bg-primary-container text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                canSubmit ? "hover:opacity-90 active:scale-[0.98]" : "opacity-40 cursor-not-allowed"
              }`}
            >
              {signupMutation.isPending && (
                <span className="material-symbols-outlined text-sm animate-spin">
                  progress_activity
                </span>
              )}
              {signupMutation.isPending ? "처리 중..." : "가입하기"}
            </button>
          </form>

          <p className="text-center text-sm text-on-surface-variant mt-6">
            이미 회원이신가요?{" "}
            <Link to="/login" className="text-primary-container font-bold hover:underline">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
