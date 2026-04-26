import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMyProfile } from "@/api/hooks/useMyProfile";
import { useUnreadCount } from "@/api/hooks/useMessages";
import { PATHS } from "@/routes/paths";

const ROLE_LABELS: Record<string, string> = {
  user: "일반 회원",
  staff: "운영진",
  admin: "관리자",
  super_admin: "최고 관리자",
};

const ROLE_COLORS: Record<string, string> = {
  user: "bg-surface-container text-on-surface-variant",
  staff: "bg-secondary-fixed text-on-secondary-fixed",
  admin: "bg-primary-fixed text-primary-container",
  super_admin: "bg-error/10 text-error",
};

const NAV_ITEMS = [
  { label: "내 정보",    to: PATHS.MYPAGE,          icon: "manage_accounts", end: true  },
  { label: "내가 쓴 글", to: PATHS.MYPAGE_POSTS,     icon: "article",         end: false },
  { label: "쪽지함",    to: PATHS.MYPAGE_MESSAGES,  icon: "mail",            end: false },
] as const;

export default function MyPageLayout() {
  const { user } = useAuth();
  const { data: profile, isLoading } = useMyProfile(user?.id);
  const { data: unreadCount = 0 } = useUnreadCount(user?.id);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-12 pb-24 md:pb-12">
      <div className="flex gap-6 items-start">
        {/* 왼쪽 사이드바 */}
        <aside className="w-64 shrink-0 space-y-3 sticky top-24">
          {/* 프로필 카드 */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-card p-5">
            {isLoading || !profile ? (
              <div className="flex flex-col items-center gap-3">
                <div className="h-16 w-16 rounded-full bg-surface-container animate-pulse" />
                <div className="h-4 w-24 rounded-full bg-surface-container animate-pulse" />
              </div>
            ) : (
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center">
                  <span className="text-2xl font-black text-white">{profile.name.charAt(0)}</span>
                </div>
                <div>
                  <h1 className="text-base font-black font-headline text-on-surface">{profile.name}</h1>
                  <div className="flex flex-wrap justify-center gap-1.5 mt-2">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${ROLE_COLORS[profile.role] ?? "bg-surface-container text-on-surface-variant"}`}>
                      {ROLE_LABELS[profile.role] ?? profile.role}
                    </span>
                    {profile.member_type && (
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${profile.member_type === "current" ? "bg-secondary-fixed text-on-secondary-fixed" : "bg-tertiary-fixed text-on-tertiary-fixed-variant"}`}>
                        {profile.member_type === "current" ? "현역" : "졸업생"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 세로 네비게이션 */}
          <nav className="bg-surface-container-lowest rounded-2xl shadow-card p-2 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? "bg-primary-container text-white"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  }`
                }
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                {item.label}
                {item.icon === "mail" && unreadCount > 0 && (
                  <span className="ml-auto text-[10px] font-black bg-error text-white rounded-full min-w-4.5 h-4.5 flex items-center justify-center px-1">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* 오른쪽 콘텐츠 */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
