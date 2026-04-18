import { Link } from "react-router-dom";
import { PATHS } from "@/routes/paths";

export default function SignupCompletePage() {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.png" alt="연세 로타랙트 로고" className="h-14 w-14 object-contain mb-3" />
          <h1 className="text-2xl font-extrabold font-headline text-primary-container">가입 완료</h1>
          <p className="text-sm text-on-surface-variant mt-1">연세 로타랙트 커뮤니티에 함께하세요</p>
        </div>

        <div className="bg-surface-container-lowest rounded-3xl shadow-card p-8">
          <div className="flex flex-col items-center text-center">
            <span className="material-symbols-outlined text-5xl text-primary-container mb-4">
              mark_email_unread
            </span>
            <h2 className="text-lg font-bold font-headline text-on-surface mb-3">
              이메일 인증이 필요합니다
            </h2>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              가입하신 이메일로 인증 메일을 발송했습니다.<br />
              메일함을 확인하고 인증 링크를 클릭해주세요.<br />
              인증 완료 후 로그인이 가능합니다.
            </p>
          </div>

          <Link to={PATHS.LOGIN}>
            <button className="w-full mt-8 py-3.5 bg-primary-container text-white font-bold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all">
              로그인 페이지로 이동
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
