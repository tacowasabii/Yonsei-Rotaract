import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { PATHS } from "@/routes/paths";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(() => localStorage.getItem("saved_email") ?? "");
  const [password, setPassword] = useState("");
  const [saveEmail, setSaveEmail] = useState(() => !!localStorage.getItem("saved_email"));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsSubmitting(true);
    setLoginError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.code === "email_not_confirmed") {
        setLoginError("이메일 인증이 필요합니다. 받은편지함을 확인해주세요.");
      } else {
        setLoginError("이메일 또는 비밀번호가 올바르지 않습니다.");
      }
      setIsSubmitting(false);
      return;
    }
    if (saveEmail) {
      localStorage.setItem("saved_email", email);
    } else {
      localStorage.removeItem("saved_email");
    }
    navigate(PATHS.HOME);
  };

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.png" alt="연세 로타랙트 로고" className="h-14 w-14 object-contain mb-3" />
          <h1 className="text-2xl font-extrabold font-headline text-primary-container">로그인</h1>
          <p className="text-sm text-on-surface-variant mt-1">커뮤니티에 오신 것을 환영합니다</p>
        </div>

        {/* Card */}
        <div className="bg-surface-container-lowest rounded-3xl shadow-card p-8">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email */}
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
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setLoginError(null); }}
                  placeholder="이메일 주소를 입력하세요"
                  className="w-full pl-11 pr-4 py-3 bg-surface-container rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary-container/30 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1.5">
                비밀번호
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
                  lock
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setLoginError(null); }}
                  placeholder="비밀번호를 입력하세요"
                  className="w-full pl-11 pr-11 py-3 bg-surface-container rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary-container/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors flex items-center"
                >
                  <span className="material-symbols-outlined text-xl leading-none">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Save email + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveEmail}
                  onChange={(e) => setSaveEmail(e.target.checked)}
                  className="w-4 h-4 accent-primary-container rounded"
                />
                <span className="text-sm text-on-surface-variant">이메일 저장</span>
              </label>
              <button type="button" onClick={() => setShowForgotModal(true)} className="text-sm text-primary-container font-semibold hover:underline">
                비밀번호 찾기
              </button>
            </div>

            {loginError && (
              <p className="text-xs text-error text-center">{loginError}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || !email || !password}
              className={`w-full py-3.5 bg-primary-container text-white font-bold rounded-xl transition-all mt-2 flex items-center justify-center gap-2 ${
                isSubmitting || !email || !password
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:opacity-90 active:scale-[0.98]"
              }`}
            >
              {isSubmitting && (
                <span className="material-symbols-outlined text-sm animate-spin">
                  progress_activity
                </span>
              )}
              {isSubmitting ? "로그인 중..." : "로그인"}
            </button>
          </form>

          {/* Sign up link */}
          <p className="text-center text-sm text-on-surface-variant mt-6">
            아직 회원이 아니신가요?{" "}
            <Link to="/signup" className="text-primary-container font-bold hover:underline">
              회원가입
            </Link>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
          onClick={() => setShowForgotModal(false)}
        >
          <div
            className="bg-surface-container-lowest rounded-3xl shadow-card p-8 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-4xl text-primary-container mb-4">
                lock_reset
              </span>
              <h2 className="text-lg font-bold font-headline text-on-surface mb-2">비밀번호 찾기</h2>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                비밀번호 재설정은 운영진에게 직접 문의해 주세요.
              </p>
            </div>
            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full mt-6 py-3 bg-primary-container text-white font-bold rounded-xl hover:opacity-90 transition-all"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
