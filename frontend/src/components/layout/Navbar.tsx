import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth, useIsStaff } from "@/contexts/AuthContext";
import { ManageAccountsIcon, PersonIcon } from "@assets/icons";
import { PATHS } from "@/routes/paths";

const navLinks = [
  { label: "소식", to: PATHS.NEWS },
  { label: "공지사항", to: PATHS.NOTICE },
  { label: "선배님", to: PATHS.ALUMNI },
  { label: "사진첩", to: PATHS.GALLERY },
];

const boardLinks = [
  { label: "자유게시판", to: PATHS.BOARD_FREE },
  { label: "홍보게시판", to: PATHS.BOARD_PROMO },
];

export default function Navbar() {
  const { profile, signOut } = useAuth();
  const isAdmin = useIsStaff();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate(PATHS.HOME);
  };

  return (
    <nav className="sticky top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-card">
      <div className="flex justify-between items-center h-16 px-6 md:px-8 max-w-7xl mx-auto">
        {/* Logo & Nav Links */}
        <div className="flex items-center gap-8">
          <NavLink to={PATHS.HOME} className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="연세 로타랙트 로고"
              className="h-9 w-9 object-contain"
            />
            <span className="text-xl font-black text-primary-container tracking-tight font-headline">
              연세 로타랙트
            </span>
          </NavLink>
          <div className="hidden md:flex gap-6 items-center">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `font-headline font-bold tracking-tight transition-colors ${
                    isActive
                      ? "text-primary-container border-b-2 border-primary-container pb-1"
                      : "text-slate-500 hover:text-primary-container"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {/* 게시판 드롭다운 */}
            <div className="relative group">
              <button className="font-headline font-bold tracking-tight transition-colors text-slate-500 hover:text-primary-container group-hover:text-primary-container">
                게시판
              </button>
              <div className="absolute top-4 left-1/2 -translate-x-1/2 pt-3 hidden group-hover:block">
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 py-1.5 min-w-30 overflow-hidden">
                  {boardLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      className={({ isActive }) =>
                        `block px-4 py-2 text-sm font-semibold transition-colors ${
                          isActive
                            ? "text-primary-container bg-primary-fixed/50"
                            : "text-slate-600 hover:text-primary-container hover:bg-surface-container"
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {profile ? (
            <>
              <div className="sm:hidden">
                <button
                  onClick={handleSignOut}
                  className="px-4 py-1.5 rounded-full text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-all"
                >
                  로그아웃
                </button>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                {isAdmin && (
                  <Link
                    to={PATHS.ADMIN}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all"
                  >
                    <ManageAccountsIcon className="w-4 h-4" />
                    관리자
                  </Link>
                )}
                <Link
                  to={PATHS.MYPAGE}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all"
                >
                  <PersonIcon className="w-4 h-4" />
                  마이페이지
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-1.5 rounded-full text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-all"
                >
                  로그아웃
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to={PATHS.LOGIN}
                className="sm:hidden px-4 py-1.5 rounded-full text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-all"
              >
                로그인
              </Link>
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to={PATHS.LOGIN}
                  className="px-4 py-1.5 rounded-full text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-all"
                >
                  로그인
                </Link>
                <Link
                  to={PATHS.SIGNUP}
                  className="px-4 py-1.5 rounded-full text-sm font-bold bg-linear-to-br from-primary to-primary-container text-white shadow-lg hover:opacity-90 active:scale-95 transition-all"
                >
                  회원가입
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
