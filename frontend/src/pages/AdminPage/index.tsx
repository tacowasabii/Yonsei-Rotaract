import { useState } from "react";
import PageLayout from "@components/layout/PageLayout";
import PageHeader from "@components/layout/PageHeader";

type Tab = "dashboard" | "pending" | "members";

type PendingStatus = "pending" | "approved" | "rejected";

const pendingSignups = [
  {
    id: 1,
    name: "정다은",
    userId: "daeun_j",
    major: "심리학과",
    year: "2024년",
    memberType: "active",
    provider: "kakao",
    appliedAt: "2025. 04. 09 14:32",
    status: "pending" as PendingStatus,
  },
  {
    id: 2,
    name: "오현우",
    userId: "hyunwoo_oh",
    major: "기계공학과",
    year: "2023년",
    memberType: "active",
    provider: "email",
    appliedAt: "2025. 04. 09 11:18",
    status: "pending" as PendingStatus,
  },
  {
    id: 3,
    name: "강민지",
    userId: "minji_k",
    major: "경제학과",
    year: "2019년",
    memberType: "alumni",
    provider: "google",
    appliedAt: "2025. 04. 08 20:05",
    status: "pending" as PendingStatus,
  },
  {
    id: 4,
    name: "윤서준",
    userId: "sjyoon",
    major: "컴퓨터과학과",
    year: "2022년",
    memberType: "active",
    provider: "naver",
    appliedAt: "2025. 04. 08 09:41",
    status: "pending" as PendingStatus,
  },
];

const members = [
  { id: 1, name: "김연세", userId: "yonsei_k", major: "경영학과", year: "2021년", memberType: "active", role: "admin", status: "active", joinedAt: "2023. 03. 01" },
  { id: 2, name: "이수현", userId: "suhyun_l", major: "사회학과", year: "2022년", memberType: "active", role: "member", status: "active", joinedAt: "2023. 03. 01" },
  { id: 3, name: "박지민", userId: "jimin_p", major: "언론정보학과", year: "2023년", memberType: "active", role: "member", status: "active", joinedAt: "2024. 03. 05" },
  { id: 4, name: "최윤서", userId: "yunseo_c", major: "의류환경학과", year: "2020년", memberType: "active", role: "member", status: "active", joinedAt: "2023. 03. 01" },
  { id: 5, name: "김도현", userId: "dohyun_k", major: "경영학과", year: "2016년", memberType: "alumni", role: "member", status: "active", joinedAt: "2023. 06. 10" },
  { id: 6, name: "이수진", userId: "sujin_l", major: "사회학과", year: "2017년", memberType: "alumni", role: "member", status: "active", joinedAt: "2024. 01. 15" },
  { id: 7, name: "한소희", userId: "sohee_h", major: "심리학과", year: "2024년", memberType: "active", role: "member", status: "inactive", joinedAt: "2024. 03. 08" },
];

const providerLabel: Record<string, { label: string; color: string }> = {
  kakao: { label: "카카오", color: "bg-[#FEE500]/40 text-[#3C1E1E]" },
  naver: { label: "네이버", color: "bg-[#03C75A]/15 text-[#03C75A]" },
  google: { label: "구글", color: "bg-slate-100 text-slate-600" },
  email: { label: "이메일", color: "bg-primary-fixed text-primary-container" },
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [statuses, setStatuses] = useState<Record<number, PendingStatus>>(
    Object.fromEntries(pendingSignups.map((p) => [p.id, p.status]))
  );
  const [memberStatuses, setMemberStatuses] = useState<Record<number, string>>(
    Object.fromEntries(members.map((m) => [m.id, m.status]))
  );
  const [memberRoles, setMemberRoles] = useState<Record<number, string>>(
    Object.fromEntries(members.map((m) => [m.id, m.role]))
  );
  const [memberSearch, setMemberSearch] = useState("");
  const [filterType, setFilterType] = useState("전체");

  const pendingCount = Object.values(statuses).filter((s) => s === "pending").length;

  const handleApprove = (id: number) => setStatuses((prev) => ({ ...prev, [id]: "approved" }));
  const handleReject = (id: number) => setStatuses((prev) => ({ ...prev, [id]: "rejected" }));

  const toggleMemberStatus = (id: number) =>
    setMemberStatuses((prev) => ({ ...prev, [id]: prev[id] === "active" ? "inactive" : "active" }));

  const toggleRole = (id: number) =>
    setMemberRoles((prev) => ({ ...prev, [id]: prev[id] === "admin" ? "member" : "admin" }));

  const filteredMembers = members.filter((m) => {
    const matchSearch =
      !memberSearch ||
      m.name.includes(memberSearch) ||
      m.userId.includes(memberSearch) ||
      m.major.includes(memberSearch);
    const matchType =
      filterType === "전체" ||
      (filterType === "현역" && m.memberType === "active") ||
      (filterType === "졸업생" && m.memberType === "alumni") ||
      (filterType === "관리자" && memberRoles[m.id] === "admin");
    return matchSearch && matchType;
  });

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "dashboard", label: "대시보드", icon: "dashboard" },
    { key: "pending", label: "가입 신청", icon: "person_add" },
    { key: "members", label: "회원 관리", icon: "group" },
  ];

  return (
    <PageLayout>
      <PageHeader
        icon="admin_panel_settings"
        title="관리자 페이지"
        subtitle="연세 로타랙트 커뮤니티 운영 관리 패널"
        badge={<span className="text-xs font-bold bg-error/10 text-error px-2 py-0.5 rounded-full">ADMIN</span>}
      />

      {/* Tab Nav */}
      <div className="flex gap-2 mb-8 border-b border-outline-variant/20 pb-0">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all -mb-px ${
              activeTab === tab.key
                ? "border-primary-container text-primary-container"
                : "border-transparent text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-base">{tab.icon}</span>
            {tab.label}
            {tab.key === "pending" && pendingCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-error text-white text-[10px] font-bold flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── DASHBOARD ── */}
      {activeTab === "dashboard" && (
        <div className="space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "전체 회원", value: members.length, icon: "group", color: "bg-primary-fixed text-primary-container" },
              { label: "가입 대기", value: pendingCount, icon: "pending", color: "bg-error/10 text-error" },
              { label: "현역 회원", value: members.filter((m) => m.memberType === "active").length, icon: "school", color: "bg-secondary-fixed text-on-secondary-fixed" },
              { label: "졸업생", value: members.filter((m) => m.memberType === "alumni").length, icon: "work", color: "bg-tertiary-fixed text-on-tertiary-fixed-variant" },
            ].map((stat) => (
              <div key={stat.label} className="bg-surface-container-lowest rounded-2xl p-5 shadow-card">
                <div className={`w-10 h-10 rounded-full ${stat.color} flex items-center justify-center mb-3`}>
                  <span className="material-symbols-outlined text-xl">{stat.icon}</span>
                </div>
                <p className="text-2xl font-extrabold font-headline text-on-surface">{stat.value}</p>
                <p className="text-xs text-on-surface-variant mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Recent Pending */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline font-bold text-on-surface">최근 가입 신청</h3>
              <button onClick={() => setActiveTab("pending")} className="text-sm text-primary-container font-semibold hover:underline flex items-center gap-1">
                전체보기
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
            <div className="space-y-3">
              {pendingSignups.slice(0, 3).map((p) => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-outline-variant/10 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center">
                      <span className="material-symbols-outlined text-base text-on-secondary-fixed-variant">person</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-on-surface">{p.name}</p>
                      <p className="text-xs text-on-surface-variant">{p.major} · {p.year}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${providerLabel[p.provider].color}`}>
                      {providerLabel[p.provider].label}
                    </span>
                    {statuses[p.id] === "pending" ? (
                      <div className="flex gap-1">
                        <button onClick={() => handleApprove(p.id)} className="px-3 py-1 bg-primary-container text-white text-xs font-bold rounded-full hover:opacity-80 transition-all">승인</button>
                        <button onClick={() => handleReject(p.id)} className="px-3 py-1 bg-error/10 text-error text-xs font-bold rounded-full hover:opacity-80 transition-all">거절</button>
                      </div>
                    ) : (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statuses[p.id] === "approved" ? "bg-primary-fixed text-primary-container" : "bg-error/10 text-error"}`}>
                        {statuses[p.id] === "approved" ? "승인됨" : "거절됨"}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: "announcement", label: "공지 작성", color: "bg-primary-fixed text-primary-container" },
              { icon: "photo_library", label: "사진첩 관리", color: "bg-secondary-fixed text-on-secondary-fixed" },
              { icon: "description", label: "회칙 수정", color: "bg-tertiary-fixed text-on-tertiary-fixed-variant" },
            ].map((action) => (
              <button key={action.label} className="bg-surface-container-lowest rounded-2xl p-5 shadow-card flex items-center gap-4 hover:bg-primary-fixed/20 transition-all text-left">
                <div className={`w-10 h-10 rounded-full ${action.color} flex items-center justify-center shrink-0`}>
                  <span className="material-symbols-outlined text-xl">{action.icon}</span>
                </div>
                <span className="font-semibold text-sm text-on-surface">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── PENDING SIGNUPS ── */}
      {activeTab === "pending" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-on-surface-variant">
              총 <span className="font-bold text-on-surface">{pendingSignups.length}건</span> 중{" "}
              <span className="font-bold text-error">{pendingCount}건</span> 대기 중
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => pendingSignups.forEach((p) => statuses[p.id] === "pending" && handleApprove(p.id))}
                className="px-4 py-1.5 bg-primary-container text-white text-sm font-bold rounded-full hover:opacity-80 transition-all"
              >
                전체 승인
              </button>
            </div>
          </div>

          {pendingSignups.map((p) => (
            <div key={p.id} className={`bg-surface-container-lowest rounded-2xl p-5 shadow-card transition-all ${statuses[p.id] !== "pending" ? "opacity-60" : ""}`}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                {/* Info */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-2xl text-on-secondary-fixed-variant">person</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-on-surface">{p.name}</p>
                      <span className="text-xs text-on-surface-variant">@{p.userId}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${providerLabel[p.provider].color}`}>
                        {providerLabel[p.provider].label}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.memberType === "active" ? "bg-secondary-fixed text-on-secondary-fixed" : "bg-tertiary-fixed text-on-tertiary-fixed-variant"}`}>
                        {p.memberType === "active" ? "현역" : "졸업생"}
                      </span>
                    </div>
                    <p className="text-sm text-on-surface-variant mt-0.5">{p.major} · {p.year} 입학</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">신청일시: {p.appliedAt}</p>
                  </div>
                </div>

                {/* Action */}
                <div className="flex items-center gap-2 shrink-0">
                  {statuses[p.id] === "pending" ? (
                    <>
                      <button
                        onClick={() => handleApprove(p.id)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-primary-container text-white text-sm font-bold rounded-full hover:opacity-80 active:scale-95 transition-all"
                      >
                        <span className="material-symbols-outlined text-base">check_circle</span>
                        승인
                      </button>
                      <button
                        onClick={() => handleReject(p.id)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-error/10 text-error text-sm font-bold rounded-full hover:opacity-80 active:scale-95 transition-all"
                      >
                        <span className="material-symbols-outlined text-base">cancel</span>
                        거절
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className={`flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-full ${statuses[p.id] === "approved" ? "bg-primary-fixed text-primary-container" : "bg-error/10 text-error"}`}>
                        <span className="material-symbols-outlined text-base">
                          {statuses[p.id] === "approved" ? "check_circle" : "cancel"}
                        </span>
                        {statuses[p.id] === "approved" ? "승인됨" : "거절됨"}
                      </span>
                      <button
                        onClick={() => setStatuses((prev) => ({ ...prev, [p.id]: "pending" }))}
                        className="text-xs text-on-surface-variant hover:text-on-surface underline"
                      >
                        되돌리기
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── MEMBER MANAGEMENT ── */}
      {activeTab === "members" && (
        <div className="space-y-4">
          {/* Search & Filter */}
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">search</span>
              <input
                type="text"
                placeholder="이름, 아이디, 학과 검색..."
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-surface-container-lowest rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary-container/30 shadow-card"
              />
            </div>
            <div className="flex gap-2">
              {["전체", "현역", "졸업생", "관리자"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterType(f)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    filterType === f
                      ? "bg-primary-container text-white"
                      : "bg-surface-container-lowest text-on-surface-variant shadow-card hover:bg-primary-fixed/20"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-on-surface-variant">총 {filteredMembers.length}명</p>

          {/* Member Table */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-outline-variant/20 bg-surface-container/50">
                    <th className="text-left px-5 py-3 text-xs font-bold text-on-surface-variant">회원</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant hidden md:table-cell">학과 / 기수</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant hidden md:table-cell">가입일</th>
                    <th className="text-center px-4 py-3 text-xs font-bold text-on-surface-variant">유형</th>
                    <th className="text-center px-4 py-3 text-xs font-bold text-on-surface-variant">권한</th>
                    <th className="text-center px-4 py-3 text-xs font-bold text-on-surface-variant">상태</th>
                    <th className="text-center px-4 py-3 text-xs font-bold text-on-surface-variant">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className={`hover:bg-primary-fixed/10 transition-colors ${memberStatuses[member.id] === "inactive" ? "opacity-50" : ""}`}>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-base text-on-secondary-fixed-variant">person</span>
                          </div>
                          <div>
                            <p className="font-semibold text-on-surface">{member.name}</p>
                            <p className="text-xs text-on-surface-variant">@{member.userId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <p className="text-on-surface">{member.major}</p>
                        <p className="text-xs text-on-surface-variant">{member.year}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-on-surface-variant hidden md:table-cell">{member.joinedAt}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${member.memberType === "active" ? "bg-secondary-fixed text-on-secondary-fixed" : "bg-tertiary-fixed text-on-tertiary-fixed-variant"}`}>
                          {member.memberType === "active" ? "현역" : "졸업생"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => toggleRole(member.id)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all hover:opacity-70 ${memberRoles[member.id] === "admin" ? "bg-error/15 text-error" : "bg-surface-container text-on-surface-variant"}`}
                        >
                          {memberRoles[member.id] === "admin" ? "관리자" : "일반"}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${memberStatuses[member.id] === "active" ? "bg-primary-fixed text-primary-container" : "bg-surface-container text-on-surface-variant"}`}>
                          {memberStatuses[member.id] === "active" ? "활성" : "비활성"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => toggleMemberStatus(member.id)}
                            className="p-1.5 rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant hover:text-on-surface"
                            title={memberStatuses[member.id] === "active" ? "비활성화" : "활성화"}
                          >
                            <span className="material-symbols-outlined text-base">
                              {memberStatuses[member.id] === "active" ? "block" : "check_circle"}
                            </span>
                          </button>
                          <button
                            className="p-1.5 rounded-lg hover:bg-error/10 transition-colors text-on-surface-variant hover:text-error"
                            title="추방"
                          >
                            <span className="material-symbols-outlined text-base">person_remove</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
