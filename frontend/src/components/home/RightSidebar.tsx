const notices = [
  { label: "IMPORTANT", title: "신입 회원 환영회 장소 변경 안내", date: "2025. 04. 08" },
  { label: null, title: "연간 회원비 납부 기한 연장", date: "2025. 04. 05" },
  { label: null, title: "시험기간 스터디룸 대여 신청", date: "2025. 04. 02" },
];

const shortcuts = [
  { icon: "description", label: "동아리 회칙", bg: "bg-primary-fixed", color: "text-primary-container" },
  { icon: "account_balance_wallet", label: "회계 내역", bg: "bg-secondary-fixed", color: "text-on-secondary-fixed" },
  { icon: "group", label: "회원 명부", bg: "bg-tertiary-fixed", color: "text-on-tertiary-fixed-variant" },
  { icon: "help", label: "자주 묻는 질문", bg: "bg-surface-variant", color: "text-on-surface-variant" },
];

export default function RightSidebar() {
  return (
    <aside className="md:col-span-3 space-y-8">
      {/* Notices List */}
      <div className="bg-surface-container-low rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-primary-container">campaign</span>
          <h4 className="font-headline font-bold text-sm">공지사항</h4>
        </div>
        <ul className="space-y-4">
          {notices.map((n, i) => (
            <li key={i} className="group">
              <a className="block" href="#">
                {n.label && (
                  <span className="text-[10px] font-bold text-error block mb-1">
                    {n.label}
                  </span>
                )}
                <span className="text-sm font-semibold text-on-surface group-hover:text-primary-container transition-colors line-clamp-1 block">
                  {n.title}
                </span>
                <span className="text-[11px] text-on-surface-variant">{n.date}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Quick Access Grid */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-card">
        <h4 className="font-headline font-bold text-sm mb-4">바로가기</h4>
        <div className="grid grid-cols-2 gap-4">
          {shortcuts.map((item) => (
            <button
              key={item.label}
              className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-50 transition-all"
            >
              <div className={`w-10 h-10 rounded-full ${item.bg} flex items-center justify-center ${item.color}`}>
                <span className="material-symbols-outlined">{item.icon}</span>
              </div>
              <span className="text-[11px] font-bold">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Vibe Meter */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-card">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-headline font-bold text-sm">커뮤니티 활성도</h4>
          <span className="text-xs font-bold text-tertiary-container">HOT</span>
        </div>
        <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden">
          <div className="bg-tertiary-fixed-dim h-full rounded-full" style={{ width: "85%" }} />
        </div>
        <p className="text-[10px] text-on-surface-variant mt-2 text-center">
          지금 142명의 멤버가 소통하고 있습니다.
        </p>
      </div>
    </aside>
  );
}
