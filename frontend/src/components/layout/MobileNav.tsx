import { NavLink } from "react-router-dom";

const navItems = [
  { icon: "campaign", label: "소식", to: "/news" },
  { icon: "forum", label: "게시판", to: "/board" },
  { icon: "school", label: "선배님", to: "/alumni" },
  { icon: "notifications", label: "공지", to: "/notice" },
  { icon: "photo_library", label: "사진첩", to: "/gallery" },
];

export default function MobileNav() {
  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav className="md:hidden bg-white/90 backdrop-blur-md fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-[env(safe-area-inset-bottom)] pt-2 border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.04)] z-50 rounded-t-2xl">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center px-2 py-1 ${
                isActive
                  ? "text-primary-container bg-primary-fixed/50 rounded-xl"
                  : "text-slate-400 hover:text-primary-container"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className="material-symbols-outlined"
                  style={isActive ? { fontVariationSettings: '"FILL" 1' } : undefined}
                >
                  {item.icon}
                </span>
                <span className="text-[10px] font-semibold">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Floating Action Button */}
      <button className="md:hidden fixed bottom-24 right-6 w-14 h-14 bg-primary-container text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform duration-150 z-40">
        <span className="material-symbols-outlined text-3xl">edit</span>
      </button>
    </>
  );
}
