import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMyProfile } from "@/api/hooks/useMyProfile";
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

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      {/* 프로필 헤더 */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-card p-6 flex items-center gap-5">
        {isLoading || !profile ? (
          <div className="h-16 w-16 rounded-full bg-surface-container animate-pulse shrink-0" />
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center shrink-0">
              <span className="text-2xl font-black text-white">{profile.name.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-black font-headline text-on-surface">{profile.name}</h1>
              <div className="flex flex-wrap gap-2 mt-1.5">
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
          </>
        )}
      </div>

      {/* 내부 네비게이션 */}
      <div className="bg-surface-container rounded-2xl p-1 flex gap-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-2 flex-1 justify-center px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                isActive
                  ? "bg-surface-container-lowest text-on-surface shadow-card"
                  : "text-on-surface-variant hover:text-on-surface"
              }`
            }
          >
            <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </div>

      {/* 하위 페이지 */}
      <Outlet />
    </div>
  );
}
