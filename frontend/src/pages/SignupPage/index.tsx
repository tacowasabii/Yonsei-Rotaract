import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

type SignupFormValues = {
  username: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirm: string;
  name: string;
  department: string;
  generation: string;
  workplace: string;
};

const GENERATION_OPTIONS = [
  ...Array.from({ length: 15 }, (_, i) => `${57.5 - i * 0.5}기`),
  "46~50기",
  "41~45기",
  "31~40기",
  "21~30기",
  "11~20기",
  "1~10기",
];

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    getValues,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<SignupFormValues>({ mode: "onBlur" });

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [memberType, setMemberType] = useState<"active" | "alumni">("active");
  const [agreedAll, setAgreedAll] = useState(false);
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    optional: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [usernameChecked, setUsernameChecked] = useState<boolean | null>(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  const [generationOpen, setGenerationOpen] = useState(false);
  const [selectedGeneration, setSelectedGeneration] = useState("");
  const generationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (generationRef.current && !generationRef.current.contains(e.target as Node)) {
        setGenerationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectGeneration = (value: string) => {
    setSelectedGeneration(value);
    setValue("generation", value, { shouldValidate: true });
    setGenerationOpen(false);
  };

  const handleCheckUsername = async () => {
    const valid = await trigger("username");
    if (!valid) return;
    setIsCheckingUsername(true);
    // TODO: 실제 중복 확인 API 연동
    await new Promise((r) => setTimeout(r, 600));
    setUsernameChecked(true);
    setIsCheckingUsername(false);
  };

  const handleAgreedAll = (checked: boolean) => {
    setAgreedAll(checked);
    setAgreements({ terms: checked, privacy: checked, optional: checked });
  };

  const handleAgreement = (key: keyof typeof agreements, checked: boolean) => {
    const next = { ...agreements, [key]: checked };
    setAgreements(next);
    setAgreedAll(Object.values(next).every(Boolean));
  };

  const onSubmit = async (data: SignupFormValues) => {
    if (!usernameChecked) return;
    setIsSubmitting(true);
    console.log({ ...data, memberType, agreements });
    // TODO: 회원가입 API 연동
    setIsSubmitting(false);
  };

  const inputClass =
    "w-full pl-11 pr-4 py-3 bg-surface-container rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary-container/30 transition-all";
  const errorClass = "mt-1 text-xs text-error flex items-center gap-1";

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 mt-12">
          <img
            src="/logo.png"
            alt="연세 로타랙트 로고"
            className="h-14 w-14 object-contain mb-3"
          />
          <h1 className="text-2xl font-extrabold font-headline text-primary-container">
            회원가입
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            연세 로타랙트 커뮤니티에 함께하세요
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-3xl shadow-card p-8">
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* 아이디 */}
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1.5">
                아이디
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
                    person
                  </span>
                  <input
                    type="text"
                    placeholder="사용할 아이디를 입력하세요"
                    disabled={usernameChecked === true}
                    className={`${inputClass} disabled:opacity-60`}
                    {...register("username", {
                      required: "아이디를 입력하세요.",
                      minLength: { value: 4, message: "4자 이상 입력하세요." },
                      maxLength: { value: 20, message: "20자 이하로 입력하세요." },
                      pattern: {
                        value: /^[a-zA-Z0-9_]+$/,
                        message: "영문, 숫자, 밑줄(_)만 사용 가능합니다.",
                      },
                      onChange: () => setUsernameChecked(null),
                    })}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleCheckUsername}
                  disabled={usernameChecked === true || isCheckingUsername}
                  className="px-4 py-3 bg-primary-fixed text-primary-container text-sm font-bold rounded-xl hover:bg-primary-fixed/70 transition-all shrink-0 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  {isCheckingUsername && (
                    <span className="material-symbols-outlined text-sm animate-spin">
                      progress_activity
                    </span>
                  )}
                  {isCheckingUsername ? "확인 중..." : "중복확인"}
                </button>
              </div>
              {errors.username && (
                <p className={errorClass}>
                  <span className="material-symbols-outlined text-sm">error</span>
                  {errors.username.message}
                </p>
              )}
              {usernameChecked === true && (
                <p className="mt-2 text-xs text-primary-container flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  사용 가능한 아이디입니다.
                </p>
              )}
              {usernameChecked === false && (
                <p className={errorClass}>
                  <span className="material-symbols-outlined text-sm">error</span>
                  이미 사용 중인 아이디입니다.
                </p>
              )}
            </div>

            {/* 비밀번호 */}
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1.5">
                비밀번호
              </label>
              <div className="flex items-center bg-surface-container rounded-xl px-3.5 focus-within:ring-2 focus-within:ring-primary-container/30 transition-all">
                <span className="material-symbols-outlined text-on-surface-variant text-xl shrink-0">
                  lock
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="영문, 숫자, 특수문자 포함 8자 이상"
                  className="flex-1 px-2.5 py-3 bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant outline-none"
                  {...register("password", {
                    required: "비밀번호를 입력하세요.",
                    minLength: { value: 8, message: "8자 이상 입력하세요." },
                    pattern: {
                      value: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
                      message: "영문, 숫자, 특수문자를 포함해야 합니다.",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-on-surface-variant hover:text-on-surface transition-colors shrink-0"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
              {errors.password && (
                <p className={errorClass}>
                  <span className="material-symbols-outlined text-sm">error</span>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1.5">
                비밀번호 확인
              </label>
              <div className="flex items-center bg-surface-container rounded-xl px-3.5 focus-within:ring-2 focus-within:ring-primary-container/30 transition-all">
                <span className="material-symbols-outlined text-on-surface-variant text-xl shrink-0">
                  lock
                </span>
                <input
                  type={showPasswordConfirm ? "text" : "password"}
                  placeholder="비밀번호를 다시 입력하세요"
                  className="flex-1 px-2.5 py-3 bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant outline-none"
                  {...register("passwordConfirm", {
                    required: "비밀번호 확인을 입력하세요.",
                    validate: (v) =>
                      v === getValues("password") ||
                      "비밀번호가 일치하지 않습니다.",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  className="text-on-surface-variant hover:text-on-surface transition-colors shrink-0"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPasswordConfirm ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
              {errors.passwordConfirm && (
                <p className={errorClass}>
                  <span className="material-symbols-outlined text-sm">error</span>
                  {errors.passwordConfirm.message}
                </p>
              )}
            </div>

            {/* 이름 */}
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1.5">
                이름
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
                  badge
                </span>
                <input
                  type="text"
                  placeholder="실명을 입력하세요"
                  className={inputClass}
                  {...register("name", { required: "이름을 입력하세요." })}
                />
              </div>
              {errors.name && (
                <p className={errorClass}>
                  <span className="material-symbols-outlined text-sm">error</span>
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* 이메일 */}
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1.5">
                이메일
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
                  mail
                </span>
                <input
                  type="email"
                  placeholder="이메일 주소를 입력하세요"
                  className={inputClass}
                  {...register("email", {
                    required: "이메일을 입력하세요.",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "올바른 이메일 주소를 입력하세요.",
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className={errorClass}>
                  <span className="material-symbols-outlined text-sm">error</span>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* 휴대폰 번호 */}
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1.5">
                휴대폰 번호
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
                  smartphone
                </span>
                <input
                  type="tel"
                  placeholder="010-0000-0000"
                  className={inputClass}
                  {...register("phone", {
                    required: "휴대폰 번호를 입력하세요.",
                    pattern: {
                      value: /^01[0-9]-?\d{3,4}-?\d{4}$/,
                      message: "올바른 휴대폰 번호를 입력하세요.",
                    },
                  })}
                />
              </div>
              {errors.phone && (
                <p className={errorClass}>
                  <span className="material-symbols-outlined text-sm">error</span>
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* 회원 유형 */}
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-2">
                회원 유형
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(["active", "alumni"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setMemberType(type)}
                    className={`py-3 rounded-xl text-sm font-bold border-2 transition-all flex items-center justify-center gap-1.5 ${
                      memberType === type
                        ? "border-primary-container bg-primary-fixed text-primary-container"
                        : "border-outline-variant/30 text-on-surface-variant hover:border-primary-container/30"
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">
                      {type === "active" ? "school" : "work"}
                    </span>
                    {type === "active" ? "현역 회원" : "졸업생 (선배)"}
                  </button>
                ))}
              </div>
            </div>

            {/* 학과 (졸업생만) */}
            {memberType === "alumni" && (
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-1.5">
                  학과
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
                    menu_book
                  </span>
                  <input
                    type="text"
                    placeholder="예) 경영학과"
                    className={inputClass}
                    {...register("department", {
                      required: "학과를 입력하세요.",
                    })}
                  />
                </div>
                {errors.department && (
                  <p className={errorClass}>
                    <span className="material-symbols-outlined text-sm">error</span>
                    {errors.department.message}
                  </p>
                )}
              </div>
            )}

            {/* 동아리 기수 (졸업생만) - 커스텀 드롭다운 */}
            {memberType === "alumni" && (
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-1.5">
                  동아리 기수
                </label>
                {/* hidden input for react-hook-form */}
                <input
                  type="hidden"
                  {...register("generation", { required: "기수를 선택하세요." })}
                />
                <div className="relative" ref={generationRef}>
                  <button
                    type="button"
                    onClick={() => setGenerationOpen((o) => !o)}
                    className={`w-full pl-11 pr-4 py-3 bg-surface-container rounded-xl text-sm text-left transition-all flex items-center justify-between ${
                      generationOpen ? "ring-2 ring-primary-container/30" : ""
                    } ${selectedGeneration ? "text-on-surface" : "text-on-surface-variant"}`}
                  >
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
                      tag
                    </span>
                    <span>{selectedGeneration || "기수 선택"}</span>
                    <span className={`material-symbols-outlined text-xl text-on-surface-variant transition-transform ${generationOpen ? "rotate-180" : ""}`}>
                      expand_more
                    </span>
                  </button>

                  {generationOpen && (
                    <div className="absolute z-50 mt-1.5 w-full bg-surface-container-lowest rounded-2xl shadow-lg border border-outline-variant/20 overflow-hidden">
                      <div className="max-h-64 overflow-y-auto">
                        {GENERATION_OPTIONS.map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => handleSelectGeneration(g)}
                            className={`w-full px-4 py-2.5 text-sm text-left transition-colors ${
                              selectedGeneration === g
                                ? "bg-primary-fixed text-primary-container font-bold"
                                : "text-on-surface hover:bg-surface-container"
                            }`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {errors.generation && (
                  <p className={errorClass}>
                    <span className="material-symbols-outlined text-sm">error</span>
                    {errors.generation.message}
                  </p>
                )}
              </div>
            )}

            {/* 직장 (졸업생) */}
            {memberType === "alumni" && (
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-1.5">
                  현재 직장/직군 (선택)
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
                    business
                  </span>
                  <input
                    type="text"
                    placeholder="예) 삼성전자 마케팅"
                    className={inputClass}
                    {...register("workplace")}
                  />
                </div>
              </div>
            )}

            {/* 약관 동의 */}
            <div className="space-y-3 pt-1">
              <label className="flex items-center gap-3 p-4 bg-primary-fixed/30 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedAll}
                  onChange={(e) => handleAgreedAll(e.target.checked)}
                  className="w-5 h-5 accent-primary-container rounded"
                />
                <span className="font-bold text-primary-container text-sm">
                  전체 동의
                </span>
              </label>
              <div className="space-y-3 pl-2">
                {[
                  { key: "terms" as const, label: "이용약관 동의", required: true },
                  { key: "privacy" as const, label: "개인정보 수집 및 이용 동의", required: true },
                  { key: "optional" as const, label: "마케팅 정보 수신 동의 (선택)", required: false },
                ].map(({ key, label, required }) => (
                  <label key={key} className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={agreements[key]}
                        onChange={(e) => handleAgreement(key, e.target.checked)}
                        className="w-4 h-4 accent-primary-container rounded"
                      />
                      <span className="text-sm text-on-surface">{label}</span>
                      {required && (
                        <span className="text-[10px] font-bold text-error">[필수]</span>
                      )}
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant text-sm">
                      chevron_right
                    </span>
                  </label>
                ))}
              </div>
              <div className="bg-surface-container rounded-xl p-4">
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  연세 로타랙트 커뮤니티는 회원 정보를 안전하게 관리합니다.
                  수집된 정보는 서비스 제공 목적으로만 사용되며, 제3자에게
                  제공되지 않습니다.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={!usernameChecked || !agreements.terms || !agreements.privacy || isSubmitting}
              className="w-full py-3.5 bg-primary-container text-white font-bold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting && (
                <span className="material-symbols-outlined text-sm animate-spin">
                  progress_activity
                </span>
              )}
              {isSubmitting ? "처리 중..." : "가입 완료"}
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
