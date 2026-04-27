export default function HeroSection() {
  return (
    <header className="mb-8 p-8 md:p-10 rounded-3xl bg-linear-to-br from-primary to-primary-container relative overflow-hidden">
      {/* Dot pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-1/2 -left-1/5 w-[150%] h-[150%] bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-size-[20px_20px]" />
      </div>
      <div className="relative z-10 text-white">
        <h1 className="text-3xl md:text-5xl font-black mb-3 tracking-tight font-headline">
          연세 로타랙트 커뮤니티에
          <br className="hidden md:block" />
          오신 것을 환영합니다
        </h1>
        <p className="text-on-primary-container text-base md:text-lg font-medium opacity-90 max-w-2xl">
          초아의 봉사를 실천하는 연세대학교 중앙봉사동아리. 현역과 졸업생이 함께
          만들어가는 우리만의 이야기를 시작하세요.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/10 backdrop-blur rounded-full text-sm font-semibold">
            <span className="material-symbols-outlined text-[18px]">group</span>
            활동 회원 124명
          </span>
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/10 backdrop-blur rounded-full text-sm font-semibold">
            <span className="material-symbols-outlined text-[18px]">
              volunteer_activism
            </span>
            누적 봉사 5,240시간
          </span>
        </div>
      </div>
    </header>
  );
}
