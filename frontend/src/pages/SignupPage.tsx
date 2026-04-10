import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const steps = ["기본 정보", "동아리 정보", "약관 동의"];
const VERIFY_TIMEOUT = 180; // 3분

export default function SignupPage() {
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [memberType, setMemberType] = useState<"active" | "alumni">("active");
  const [agreedAll, setAgreedAll] = useState(false);
  const [agreements, setAgreements] = useState({ terms: false, privacy: false, optional: false });

  // 이메일 인증 상태
  const [email, setEmail] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [verifyError, setVerifyError] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(VERIFY_TIMEOUT);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const handleSendCode = () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setVerifyError("올바른 이메일 주소를 입력하세요.");
      return;
    }
    setVerifyError("");
    setCodeSent(true);
    setVerifyCode("");
    setIsVerified(false);
    startTimer();
  };

  const handleVerifyCode = () => {
    if (verifyCode.length !== 6) {
      setVerifyError("인증번호 6자리를 입력하세요.");
      return;
    }
    // TODO: 실제 서버 검증으로 교체
    if (verifyCode === "123456") {
      setIsVerified(true);
      setVerifyError("");
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      setVerifyError("인증번호가 올바르지 않습니다.");
    }
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

  return (
    <main className="min-h-screen flex items-center justify-center px-4 pt-16 pb-12">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.png" alt="연세 로타랙트 로고" className="h-14 w-14 object-contain mb-3" />
          <h1 className="text-2xl font-extrabold font-headline text-primary-container">회원가입</h1>
          <p className="text-sm text-on-surface-variant mt-1">연세 로타랙트 커뮤니티에 함께하세요</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-0 mb-8">
          {steps.map((label, i) => (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    i < step
                      ? "bg-primary-container text-white"
                      : i === step
                      ? "bg-primary-container text-white ring-4 ring-primary-fixed"
                      : "bg-surface-container text-on-surface-variant"
                  }`}
                >
                  {i < step ? (
                    <span className="material-symbols-outlined text-base">check</span>
                  ) : (
                    i + 1
                  )}
                </div>
                <span className={`text-[10px] font-semibold mt-1 ${i === step ? "text-primary-container" : "text-on-surface-variant"}`}>
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-16 h-0.5 mb-4 mx-1 transition-all ${i < step ? "bg-primary-container" : "bg-outline-variant/30"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-surface-container-lowest rounded-3xl shadow-card p-8">
          {/* Step 0: 기본 정보 */}
          {step === 0 && (
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <h2 className="text-lg font-bold font-headline text-on-surface mb-4">기본 정보 입력</h2>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-1.5">이메일</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">mail</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setVerifyError(""); }}
                      placeholder="이메일 주소를 입력하세요"
                      disabled={isVerified}
                      className="w-full pl-11 pr-4 py-3 bg-surface-container rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary-container/30 transition-all disabled:opacity-60"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={isVerified}
                    className="px-4 py-3 bg-primary-fixed text-primary-container text-sm font-bold rounded-xl hover:bg-primary-fixed/70 transition-all shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {codeSent ? "재발송" : "인증번호 발송"}
                  </button>
                </div>

                {/* 인증번호 입력 */}
                {codeSent && !isVerified && (
                  <div className="mt-2 space-y-2">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">pin</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          value={verifyCode}
                          onChange={(e) => { setVerifyCode(e.target.value.replace(/\D/g, "")); setVerifyError(""); }}
                          placeholder="인증번호 6자리"
                          className="w-full pl-11 pr-20 py-3 bg-surface-container rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary-container/30 transition-all"
                        />
                        <span className={`absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-bold tabular-nums ${timeLeft <= 30 ? "text-error" : "text-on-surface-variant"}`}>
                          {timeLeft > 0 ? formatTime(timeLeft) : "만료"}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleVerifyCode}
                        disabled={timeLeft === 0}
                        className="px-4 py-3 bg-primary-container text-white text-sm font-bold rounded-xl hover:opacity-90 transition-all shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        확인
                      </button>
                    </div>
                    {verifyError && (
                      <p className="text-xs text-error flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">error</span>
                        {verifyError}
                      </p>
                    )}
                    <p className="text-xs text-on-surface-variant">인증번호가 오지 않으면 스팸함을 확인하거나 재발송해 주세요.</p>
                  </div>
                )}

                {/* 인증 완료 */}
                {isVerified && (
                  <p className="mt-2 text-xs text-primary-container flex items-center gap-1 font-semibold">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    이메일 인증이 완료되었습니다.
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-1.5">비밀번호</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">lock</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="영문, 숫자, 특수문자 포함 8자 이상"
                    className="w-full pl-11 pr-11 py-3 bg-surface-container rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary-container/30 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Password Confirm */}
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-1.5">비밀번호 확인</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">lock</span>
                  <input
                    type="password"
                    placeholder="비밀번호를 다시 입력하세요"
                    className="w-full pl-11 pr-4 py-3 bg-surface-container rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary-container/30 transition-all"
                  />
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-1.5">이름</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">badge</span>
                  <input
                    type="text"
                    placeholder="실명을 입력하세요"
                    className="w-full pl-11 pr-4 py-3 bg-surface-container rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary-container/30 transition-all"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={!isVerified}
                className="w-full py-3.5 bg-primary-container text-white font-bold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all mt-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                다음
              </button>
            </form>
          )}

          {/* Step 1: 동아리 정보 */}
          {step === 1 && (
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <h2 className="text-lg font-bold font-headline text-on-surface mb-4">동아리 정보</h2>

              {/* Member Type */}
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-2">회원 유형</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMemberType("active")}
                    className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                      memberType === "active"
                        ? "border-primary-container bg-primary-fixed text-primary-container"
                        : "border-outline-variant/30 text-on-surface-variant hover:border-primary-container/30"
                    }`}
                  >
                    <span className="material-symbols-outlined block text-xl mb-0.5">school</span>
                    현역 회원
                  </button>
                  <button
                    type="button"
                    onClick={() => setMemberType("alumni")}
                    className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                      memberType === "alumni"
                        ? "border-primary-container bg-primary-fixed text-primary-container"
                        : "border-outline-variant/30 text-on-surface-variant hover:border-primary-container/30"
                    }`}
                  >
                    <span className="material-symbols-outlined block text-xl mb-0.5">work</span>
                    졸업생 (선배)
                  </button>
                </div>
              </div>

              {/* Major */}
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-1.5">학과</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">menu_book</span>
                  <input
                    type="text"
                    placeholder="예) 경영학과"
                    className="w-full pl-11 pr-4 py-3 bg-surface-container rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary-container/30 transition-all"
                  />
                </div>
              </div>

              {/* Admission Year */}
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-1.5">
                  {memberType === "active" ? "입학년도" : "졸업년도"}
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">calendar_today</span>
                  <select className="w-full pl-11 pr-4 py-3 bg-surface-container rounded-xl text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary-container/30 transition-all appearance-none">
                    <option value="">년도 선택</option>
                    {Array.from({ length: 15 }, (_, i) => 2025 - i).map((y) => (
                      <option key={y} value={y}>{y}년</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Alumni extra field */}
              {memberType === "alumni" && (
                <div>
                  <label className="block text-sm font-semibold text-on-surface mb-1.5">현재 직장/직군 (선택)</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">business</span>
                    <input
                      type="text"
                      placeholder="예) 삼성전자 마케팅"
                      className="w-full pl-11 pr-4 py-3 bg-surface-container rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary-container/30 transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="flex-1 py-3.5 bg-surface-container text-on-surface-variant font-bold rounded-xl hover:bg-surface-container-high transition-all"
                >
                  이전
                </button>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 py-3.5 bg-primary-container text-white font-bold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  다음
                </button>
              </div>
            </form>
          )}

          {/* Step 2: 약관 동의 */}
          {step === 2 && (
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <h2 className="text-lg font-bold font-headline text-on-surface mb-4">약관 동의</h2>

              {/* All agree */}
              <label className="flex items-center gap-3 p-4 bg-primary-fixed/30 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedAll}
                  onChange={(e) => handleAgreedAll(e.target.checked)}
                  className="w-5 h-5 accent-primary-container rounded"
                />
                <span className="font-bold text-primary-container text-sm">전체 동의</span>
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
                      {required && <span className="text-[10px] font-bold text-error">[필수]</span>}
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant text-sm">chevron_right</span>
                  </label>
                ))}
              </div>

              <div className="bg-surface-container rounded-xl p-4 mt-2">
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  연세 로타랙트 커뮤니티는 회원 정보를 안전하게 관리합니다. 수집된 정보는 서비스 제공 목적으로만 사용되며, 제3자에게 제공되지 않습니다.
                </p>
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3.5 bg-surface-container text-on-surface-variant font-bold rounded-xl hover:bg-surface-container-high transition-all"
                >
                  이전
                </button>
                <button
                  type="submit"
                  disabled={!agreements.terms || !agreements.privacy}
                  className="flex-1 py-3.5 bg-primary-container text-white font-bold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  가입 완료
                </button>
              </div>
            </form>
          )}

          {/* Login link */}
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
