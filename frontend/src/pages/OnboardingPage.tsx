import { useState } from "react";
import { Link } from "react-router-dom";

const steps = ["동아리 정보", "약관 동의"];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [memberType, setMemberType] = useState<"active" | "alumni">("active");
  const [agreedAll, setAgreedAll] = useState(false);
  const [agreements, setAgreements] = useState({ terms: false, privacy: false, optional: false });

  // 실제 구현 시 소셜 로그인 응답에서 받아오는 값
  const socialUser = { name: "김연세", provider: "kakao" as "kakao" | "naver" | "google" };

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
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.png" alt="연세 로타랙트 로고" className="h-14 w-14 object-contain mb-3" />
          <h1 className="text-2xl font-extrabold font-headline text-primary-container">거의 다 됐어요!</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            <span className="font-semibold text-on-surface">{socialUser.name}</span>님, 동아리 정보를 입력해주세요.
          </p>
        </div>

        {/* Social Badge */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {socialUser.provider === "kakao" && (
            <div className="flex items-center gap-2 bg-[#FEE500]/30 px-4 py-2 rounded-full">
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <path d="M9 1C4.58 1 1 3.91 1 7.5c0 2.32 1.52 4.36 3.83 5.54L4 16l3.64-1.9C8.08 14.17 8.54 14.2 9 14.2c4.42 0 8-2.91 8-6.7C17 3.91 13.42 1 9 1z" fill="#3C1E1E"/>
              </svg>
              <span className="text-xs font-semibold text-[#3C1E1E]">카카오 계정으로 연결됨</span>
            </div>
          )}
          {socialUser.provider === "naver" && (
            <div className="flex items-center gap-2 bg-[#03C75A]/15 px-4 py-2 rounded-full">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" fill="#03C75A"/>
              </svg>
              <span className="text-xs font-semibold text-[#03C75A]">네이버 계정으로 연결됨</span>
            </div>
          )}
          {socialUser.provider === "google" && (
            <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full">
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-xs font-semibold text-slate-600">구글 계정으로 연결됨</span>
            </div>
          )}
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
                <div className={`w-20 h-0.5 mb-4 mx-1 transition-all ${i < step ? "bg-primary-container" : "bg-outline-variant/30"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-surface-container-lowest rounded-3xl shadow-card p-8">

          {/* Step 0: 동아리 정보 */}
          {step === 0 && (
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

              {/* Name (prefilled from social) */}
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-1.5">
                  이름
                  <span className="text-[10px] text-on-surface-variant font-normal ml-2">카카오에서 불러옴</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">badge</span>
                  <input
                    type="text"
                    defaultValue={socialUser.name}
                    className="w-full pl-11 pr-4 py-3 bg-surface-container rounded-xl text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary-container/30 transition-all"
                  />
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

              {/* Year */}
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

              {/* Alumni extra */}
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

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full py-3.5 bg-primary-container text-white font-bold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all mt-2"
              >
                다음
              </button>
            </form>
          )}

          {/* Step 1: 약관 동의 */}
          {step === 1 && (
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <h2 className="text-lg font-bold font-headline text-on-surface mb-4">약관 동의</h2>

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
                  onClick={() => setStep(0)}
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

          <p className="text-center text-xs text-on-surface-variant mt-6">
            다른 계정으로 로그인하려면?{" "}
            <Link to="/login" className="text-primary-container font-bold hover:underline">
              돌아가기
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
