export default function Footer() {
  return (
    <footer className="bg-surface-container w-full py-16 px-6 md:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
        <div className="space-y-4">
          <div className="font-headline font-bold text-on-surface text-xl">
            연세 로타랙트
          </div>
          <p className="text-sm leading-relaxed text-on-surface-variant max-w-sm">
            초아의 봉사를 실천하는 연세대학교 중앙봉사동아리입니다. 현역과
            졸업생이 함께 소통하며 더 넓은 세상으로 나아가는 로타랙트의 여정을
            함께합니다.
          </p>
          <p className="text-xs text-on-surface-variant/60">
            © 2024 연세 로타랙트. All rights reserved.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-12 gap-y-4 md:justify-end">
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-on-surface uppercase tracking-wider">
              서비스
            </h5>
            <ul className="space-y-2">
              <li>
                <a
                  className="text-on-surface-variant hover:text-primary-container text-sm transition-colors"
                  href="#"
                >
                  이용약관
                </a>
              </li>
              <li>
                <a
                  className="text-primary-container font-bold text-sm hover:underline"
                  href="#"
                >
                  개인정보처리방침
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-on-surface uppercase tracking-wider">
              커뮤니티
            </h5>
            <ul className="space-y-2">
              <li>
                <a
                  className="text-on-surface-variant hover:text-primary-container text-sm transition-colors"
                  href="#"
                >
                  동아리 소개
                </a>
              </li>
              <li>
                <a
                  className="text-on-surface-variant hover:text-primary-container text-sm transition-colors"
                  href="#"
                >
                  제휴문의
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
