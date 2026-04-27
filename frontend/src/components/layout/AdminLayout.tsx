import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePendingMembers } from "@/api/hooks/profiles/usePendingMembers";
import { PATHS } from "@/routes/paths";
import RoleBadge from "@components/common/RoleBadge";

const navItems = [
  { to: PATHS.ADMIN,           label: "대시보드", icon: "dashboard",          end: true  },
  { to: PATHS.ADMIN_PENDING,   label: "가입 신청", icon: "person_add",         end: false },
  { to: PATHS.ADMIN_MEMBERS,   label: "회원 관리", icon: "group",              end: false },
  { to: PATHS.ADMIN_DONATIONS, label: "후원 관리", icon: "volunteer_activism", end: false },
];

export default function AdminLayout() {
  const { profile, role, signOut } = useAuth();
  const { data: pendingMembers = [] } = usePendingMembers();
  const navigate = useNavigate();
  const pendingCount = pendingMembers.length;

  const handleSignOut = async () => {
    await signOut();
    navigate(PATHS.HOME);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-primary-container flex flex-col fixed top-0 left-0 h-screen z-40">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/10">
          <Link to={PATHS.HOME} className="flex items-center gap-2.5 mb-1">
            <img src="/logo.png" alt="연세 로타랙트 로고" className="h-8 w-8 object-contain" />
            <span className="text-white font-black font-headline tracking-tight text-base leading-tight">
              연세 로타랙트
            </span>
          </Link>
          <p className="text-white/40 text-[10px] font-bold tracking-widest uppercase pl-0.5">Admin Panel</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-white/15 text-white"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              <span>{item.label}</span>
              {item.icon === "person_add" && pendingCount > 0 && (
                <span className="ml-auto w-5 h-5 rounded-full bg-error text-white text-[10px] font-bold flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-white/10 space-y-1">
          {profile && (
            <div className="flex items-center gap-3 px-2 py-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-white">{profile.name.charAt(0)}</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{profile.name}</p>
                <RoleBadge role={role} showAll variant="dark" />
              </div>
            </div>
          )}
          <Link
            to={PATHS.HOME}
            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-white/60 hover:bg-white/10 hover:text-white transition-all"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            메인 사이트로
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-white/60 hover:bg-white/10 hover:text-white transition-all"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            로그아웃
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 overflow-auto min-h-screen">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
