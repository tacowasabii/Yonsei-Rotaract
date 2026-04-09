export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-card">
      <div className="flex justify-between items-center h-16 px-6 md:px-8 max-w-7xl mx-auto">
        {/* Logo & Nav Links */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="연세 로타랙트 로고"
              className="h-9 w-9 object-contain"
            />
            <span className="text-xl font-black text-primary-container tracking-tight font-headline">
              연세 로타랙트
            </span>
          </div>
          <div className="hidden md:flex gap-6">
            <a
              href="#"
              className="font-headline font-bold tracking-tight text-primary-container border-b-2 border-primary-container pb-1"
            >
              소식
            </a>
            <a
              href="#"
              className="font-headline font-bold tracking-tight text-slate-500 hover:text-primary-container transition-colors"
            >
              게시판
            </a>
            <a
              href="#"
              className="font-headline font-bold tracking-tight text-slate-500 hover:text-primary-container transition-colors"
            >
              선배님
            </a>
            <a
              href="#"
              className="font-headline font-bold tracking-tight text-slate-500 hover:text-primary-container transition-colors"
            >
              사진첩
            </a>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button className="material-symbols-outlined text-slate-500 p-2 hover:bg-surface-container rounded-full transition-colors">
            search
          </button>
          <div className="hidden sm:flex gap-2">
            <button className="px-4 py-1.5 rounded-full text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-all">
              로그인
            </button>
            <button className="px-4 py-1.5 rounded-full text-sm font-bold bg-gradient-to-br from-primary to-primary-container text-white shadow-lg hover:opacity-90 active:scale-95 transition-all">
              회원가입
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
