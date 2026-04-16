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
    <main className="flex-1 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <img src="/logo.png" alt="연세 로타랙트 로고" className="h-16 w-16 object-contain mb-4" />
          <h1 className="text-2xl font-extrabold font-headline text-primary-container">연세 로타랙트</h1>
          <p className="text-sm text-on-surface-variant mt-1">커뮤니티에 오신 것을 환영합니다</p>
        </div>

        {/* Card */}
        <div className="bg-surface-container-lowest rounded-3xl shadow-card p-8">
          <h2 className="text-xl font-bold font-headline text-on-surface mb-6">로그인</h2>

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
              <button type="button" className="text-sm text-primary-container font-semibold hover:underline">
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

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-outline-variant/30" />
            <span className="text-xs text-on-surface-variant">또는</span>
            <div className="flex-1 h-px bg-outline-variant/30" />
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-3 py-3 bg-[#03C75A] text-white font-bold rounded-xl hover:opacity-90 transition-all text-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" fill="white"/>
              </svg>
              네이버로 로그인
            </button>
            <button className="w-full flex items-center justify-center gap-3 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all text-sm shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              구글로 로그인
            </button>
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm text-on-surface-variant mt-6">
            아직 회원이 아니신가요?{" "}
            <Link to="/signup" className="text-primary-container font-bold hover:underline">
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
