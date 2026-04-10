import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const VERIFY_TIMEOUT = 180;

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [memberType, setMemberType] = useState<"active" | "alumni">("active");
  const [joinInputType, setJoinInputType] = useState<"generation" | "semester">(
    "generation",
  );
  const [agreedAll, setAgreedAll] = useState(false);
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    optional: false,
  });

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

  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current);
    },
    [],
  );

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

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
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {/* 이메일 */}
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
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setVerifyError("");
                    }}
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
              {codeSent && !isVerified && (
                <div className="mt-2 space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
                        pin
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={verifyCode}
                        onChange={(e) => {
                          setVerifyCode(e.target.value.replace(/\D/g, ""));
                          setVerifyError("");
                        }}
                        placeholder="인증번호 6자리"
                        className="w-full pl-11 pr-20 py-3 bg-surface-container rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary-container/30 transition-all"
                      />
                      <span
                        className={`absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-bold tabular-nums ${timeLeft <= 30 ? "text-error" : "text-on-surface-variant"}`}
                      >
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
                      <span className="material-symbols-outlined text-sm">
                        error
                      </span>
                      {verifyError}
                    </p>
                  )}
                  <p className="text-xs text-on-surface-variant">
                    인증번호가 오지 않으면 스팸함을 확인하거나 재발송해 주세요.
                  </p>
                </div>
              )}
              {isVerified && (
                <p className="mt-2 text-xs text-primary-container flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-sm">
                    check_circle
                  </span>
                  이메일 인증이 완료되었습니다.
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
                  className="w-full pl-11 pr-4 py-3 bg-surface-container rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary-container/30 transition-all"
                />
              </div>
            </div>

            {/* 회원 유형 */}
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-2">
                회원 유형
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMemberType("active")}
                  className={`py-3 rounded-xl text-sm font-bold border-2 transition-all flex items-center justify-center gap-1.5 ${
                    memberType === "active"
                      ? "border-primary-container bg-primary-fixed text-primary-container"
                      : "border-outline-variant/30 text-on-surface-variant hover:border-primary-container/30"
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">
                    school
                  </span>
                  현역 회원
                </button>
                <button
                  type="button"
                  onClick={() => setMemberType("alumni")}
                  className={`py-3 rounded-xl text-sm font-bold border-2 transition-all flex items-center justify-center gap-1.5 ${
                    memberType === "alumni"
                      ? "border-primary-container bg-primary-fixed text-primary-container"
                      : "border-outline-variant/30 text-on-surface-variant hover:border-primary-container/30"
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">
                    work
                  </span>
                  졸업생 (선배)
                </button>
              </div>
            </div>

            {/* 학과 */}
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
                  className="w-full pl-11 pr-4 py-3 bg-surface-container rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary-container/30 transition-all"
                />
              </div>
            </div>

            {/* 기수 / 가입 학기 */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-on-surface">
                  {joinInputType === "generation" ? "동아리 기수" : "가입 학기"}
                </label>
                <div className="flex bg-surface-container rounded-lg p-0.5 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setJoinInputType("generation")}
                    className={`px-3 py-1 rounded-md transition-all ${joinInputType === "generation" ? "bg-primary-container text-white" : "text-on-surface-variant"}`}
                  >
                    기수
                  </button>
                  <button
                    type="button"
                    onClick={() => setJoinInputType("semester")}
                    className={`px-3 py-1 rounded-md transition-all ${joinInputType === "semester" ? "bg-primary-container text-white" : "text-on-surface-variant"}`}
                  >
                    학기
                  </button>
                </div>
              </div>
              {joinInputType === "generation" ? (
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
                    tag
                  </span>
                  <input
                    type="number"
                    min={1}
                    placeholder="예) 35"
                    className="w-full pl-11 pr-10 py-3 bg-surface-container rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary-container/30 transition-all"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant font-semibold">
                    기
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
                      calendar_today
                    </span>
                    <select className="w-full pl-11 pr-4 py-3 bg-surface-container rounded-xl text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary-container/30 transition-all appearance-none">
                      <option value="">년도 선택</option>
                      {Array.from({ length: 15 }, (_, i) => 2025 - i).map(
                        (y) => (
                          <option key={y} value={y}>
                            {y}년
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
                      event
                    </span>
                    <select className="w-full pl-11 pr-4 py-3 bg-surface-container rounded-xl text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary-container/30 transition-all appearance-none">
                      <option value="">학기 선택</option>
                      <option value="1">1학기</option>
                      <option value="2">2학기</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

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
                    className="w-full pl-11 pr-4 py-3 bg-surface-container rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary-container/30 transition-all"
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
                  {
                    key: "terms" as const,
                    label: "이용약관 동의",
                    required: true,
                  },
                  {
                    key: "privacy" as const,
                    label: "개인정보 수집 및 이용 동의",
                    required: true,
                  },
                  {
                    key: "optional" as const,
                    label: "마케팅 정보 수신 동의 (선택)",
                    required: false,
                  },
                ].map(({ key, label, required }) => (
                  <label
                    key={key}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={agreements[key]}
                        onChange={(e) => handleAgreement(key, e.target.checked)}
                        className="w-4 h-4 accent-primary-container rounded"
                      />
                      <span className="text-sm text-on-surface">{label}</span>
                      {required && (
                        <span className="text-[10px] font-bold text-error">
                          [필수]
                        </span>
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
              disabled={!isVerified || !agreements.terms || !agreements.privacy}
              className="w-full py-3.5 bg-primary-container text-white font-bold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              가입 완료
            </button>
          </form>

          <p className="text-center text-sm text-on-surface-variant mt-6">
            이미 회원이신가요?{" "}
            <Link
              to="/login"
              className="text-primary-container font-bold hover:underline"
            >
              로그인
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
