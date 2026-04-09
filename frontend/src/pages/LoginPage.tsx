import { useState } from "react";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="min-h-screen flex items-center justify-center px-4 pt-16">
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

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {/* ID */}
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1.5">
                아이디
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
                  person
                </span>
                <input
                  type="text"
                  placeholder="아이디를 입력하세요"
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
                  placeholder="비밀번호를 입력하세요"
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

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-primary-container rounded" />
                <span className="text-sm text-on-surface-variant">로그인 유지</span>
              </label>
              <button type="button" className="text-sm text-primary-container font-semibold hover:underline">
                비밀번호 찾기
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 bg-primary-container text-white font-bold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all mt-2"
            >
              로그인
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
            <button className="w-full flex items-center justify-center gap-3 py-3 bg-[#FEE500] text-[#3C1E1E] font-bold rounded-xl hover:opacity-90 transition-all text-sm">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 1C4.58 1 1 3.91 1 7.5c0 2.32 1.52 4.36 3.83 5.54L4 16l3.64-1.9C8.08 14.17 8.54 14.2 9 14.2c4.42 0 8-2.91 8-6.7C17 3.91 13.42 1 9 1z" fill="#3C1E1E"/>
              </svg>
              카카오로 로그인
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
