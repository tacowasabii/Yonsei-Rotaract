import { AccountCircleIcon } from "@assets/icons";

export default function LeftSidebar() {
  return (
    <aside className="md:col-span-3 space-y-6">
      {/* User Profile Card - centered like main2 */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-card flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-secondary-fixed mb-4 overflow-hidden flex items-center justify-center">
          <AccountCircleIcon className="w-10 h-10 text-on-secondary-fixed-variant" />
        </div>
        <h3 className="font-headline font-bold text-lg text-on-surface">
          김연세
        </h3>
        <p className="text-sm text-on-surface-variant mb-4">
          경영학과 21학번 · 정회원
        </p>
        <div className="grid grid-cols-2 w-full gap-2 border-t border-outline-variant/20 pt-4">
          <div className="flex flex-col">
            <span className="text-xs text-on-surface-variant">내 게시글</span>
            <span className="font-bold text-primary-container">12</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-on-surface-variant">스크랩</span>
            <span className="font-bold text-primary-container">45</span>
          </div>
        </div>
      </div>

      {/* Calendar Widget */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-card">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-headline font-bold text-sm">동아리 일정</h4>
          <span className="text-xs text-primary-container font-semibold">
            2025. 04
          </span>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] mb-2 font-bold text-on-surface-variant">
          {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {["", "", "1", "2", "3", "4", "5"].map((d, i) => (
            <span key={i} className={`p-1 ${!d ? "text-slate-300" : ""}`}>
              {d || ""}
            </span>
          ))}
          {["6", "7", "8", "9", "10"].map((d) => (
            <span key={d} className="p-1">
              {d}
            </span>
          ))}
          <span className="p-1 bg-primary-fixed text-on-primary-fixed rounded-full font-bold">
            10
          </span>
          <span className="p-1 text-slate-300">11</span>
          {["12", "13", "14", "15", "16", "17", "18"].map((d) => (
            <span
              key={d}
              className={`p-1 ${
                d === "15"
                  ? "bg-tertiary-fixed text-on-tertiary-fixed rounded-full font-bold"
                  : ""
              }`}
            >
              {d}
            </span>
          ))}
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-primary-container shrink-0" />
            <span className="text-on-surface">신촌 무료급식소 봉사</span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-tertiary-container shrink-0" />
            <span className="text-on-surface">로타랙트 정기 집회</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
