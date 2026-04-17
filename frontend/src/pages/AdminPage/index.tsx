import { useState } from "react";
import PageLayout from "@components/layout/PageLayout";
import PageHeader from "@components/layout/PageHeader";
import { useAuth } from "@/contexts/AuthContext";
import type { AppRole, Member } from "@/api/types/member";
import { useMembers, useUpdateMemberRole, useUpdateMemberStatus } from "@/api/hooks/useMembers";
import { usePendingMembers, useApproveMember, useRejectMember, useApproveAllPending } from "@/api/hooks/usePendingMembers";
import { ManageAccountsIcon } from "@assets/icons";

type Tab = "dashboard" | "pending" | "members";

// ── 상수 ──────────────────────────────────────────────────────────────────────

const ROLE_HIERARCHY: Record<AppRole, number> = {
  user: 1, staff: 2, admin: 3, super_admin: 4,
};

const ROLE_META: Record<AppRole, { label: string; color: string }> = {
  user:        { label: "일반",       color: "bg-surface-container text-on-surface-variant" },
  staff:       { label: "운영진",     color: "bg-secondary-fixed text-on-secondary-fixed" },
  admin:       { label: "관리자",     color: "bg-error/15 text-error" },
  super_admin: { label: "슈퍼관리자", color: "bg-error text-white" },
};

function assignableRoles(viewerRole: AppRole, targetRole: AppRole): AppRole[] {
  if (viewerRole === "super_admin") return ["user", "staff", "admin", "super_admin"];
  if (viewerRole === "admin" && ROLE_HIERARCHY[targetRole] < ROLE_HIERARCHY["admin"])
    return ["user", "staff"];
  return [];
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, "0")}. ${String(d.getDate()).padStart(2, "0")}`;
}

// ── Mock 데이터 ───────────────────────────────────────────────────────────────

const MOCK_MEMBERS: Member[] = [
  { id: "m2",  name: "이수현", email: "test_leesuhyun@rotaract.test",  phone: "01011110002", member_type: "current", admission_year: 2022, department: "사회학과",     generation: "37기", role: "admin",  status: "active",   created_at: "2023-03-01T00:00:00" },
  { id: "m3",  name: "박지민", email: "test_parkjimin@rotaract.test",  phone: "01011110003", member_type: "current", admission_year: 2023, department: "언론정보학과",  generation: "39기", role: "staff",  status: "active",   created_at: "2024-03-05T00:00:00" },
  { id: "m4",  name: "최윤서", email: "test_choiyunseo@rotaract.test", phone: "01011110004", member_type: "current", admission_year: 2020, department: "의류환경학과",  generation: "33기", role: "staff",  status: "active",   created_at: "2023-03-01T00:00:00" },
  { id: "m5",  name: "강민지", email: "test_kangminji@rotaract.test",  phone: "01011110005", member_type: "alumni",  admission_year: 2019, department: "경제학과",     generation: "33기", role: "staff",  status: "active",   created_at: "2022-06-20T00:00:00" },
  { id: "m6",  name: "정다은", email: "test_jungdaeun@rotaract.test",  phone: "01011110006", member_type: "current", admission_year: 2024, department: "심리학과",     generation: "41기", role: "user",   status: "active",   created_at: "2024-03-10T00:00:00" },
  { id: "m7",  name: "오현우", email: "test_ohhyunwoo@rotaract.test",  phone: "01011110007", member_type: "current", admission_year: 2023, department: "기계공학과",   generation: "39기", role: "user",   status: "active",   created_at: "2024-03-05T00:00:00" },
  { id: "m8",  name: "윤서준", email: "test_yoonseojun@rotaract.test", phone: "01011110008", member_type: "current", admission_year: 2022, department: "컴퓨터과학과", generation: "37기", role: "user",   status: "inactive", created_at: "2024-09-03T00:00:00" },
  { id: "m9",  name: "김도현", email: "test_kimdohyun@rotaract.test",  phone: "01011110009", member_type: "alumni",  admission_year: 2016, department: "경영학과",     generation: "28기", role: "user",   status: "active",   created_at: "2023-06-10T00:00:00" },
  { id: "m10", name: "이수진", email: "test_leesujin@rotaract.test",   phone: "01011110010", member_type: "alumni",  admission_year: 2017, department: "사회학과",     generation: "30기", role: "user",   status: "active",   created_at: "2024-01-15T00:00:00" },
];

// ── 컴포넌트 ──────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const { role: viewerRole } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [memberSearch, setMemberSearch] = useState("");
  const [filterType, setFilterType] = useState("전체");

  const { data: fetchedMembers, isLoading: membersLoading } = useMembers();
  const { data: pendingMembers = [], isLoading: pendingLoading } = usePendingMembers();
  const approveMember = useApproveMember();
  const rejectMember = useRejectMember();
  const approveAll = useApproveAllPending();
  const updateRole = useUpdateMemberRole();
  const updateStatus = useUpdateMemberStatus();

  const isMockData = !fetchedMembers || fetchedMembers.length === 0;
  const members = isMockData ? MOCK_MEMBERS : fetchedMembers;
  const pendingCount = pendingMembers.length;

  const handleRoleChange = (memberId: string, newRole: AppRole) => {
    if (isMockData) return;
    updateRole.mutate({ memberId, newRole });
  };

  const handleStatusToggle = (memberId: string, currentStatus: "active" | "inactive") => {
    if (isMockData) return;
    updateStatus.mutate({ memberId, newStatus: currentStatus === "active" ? "inactive" : "active" });
  };

  const filteredMembers = members.filter((m) => {
    if (m.role === "super_admin") return false;
    const matchSearch =
      !memberSearch ||
      m.name.includes(memberSearch) ||
      m.email.includes(memberSearch) ||
      (m.department ?? "").includes(memberSearch);
    const matchType =
      filterType === "전체" ||
      (filterType === "현역"   && m.member_type === "current") ||
      (filterType === "졸업생" && m.member_type === "alumni") ||
      (filterType === "운영진" && m.role === "staff") ||
      (filterType === "관리자" && m.role === "admin");
    return matchSearch && matchType;
  });

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "dashboard", label: "대시보드", icon: "dashboard" },
    { key: "pending",   label: "가입 신청", icon: "person_add" },
    { key: "members",   label: "회원 관리", icon: "group" },
  ];

  return (
    <PageLayout>
      <PageHeader
        iconNode={<ManageAccountsIcon />}
        title="관리자 페이지"
        subtitle="연세 로타랙트 커뮤니티 운영 관리 패널"
        badge={
          viewerRole ? (
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${ROLE_META[viewerRole].color}`}>
              {ROLE_META[viewerRole].label.toUpperCase()}
            </span>
          ) : (
            <span className="text-xs font-bold bg-error/10 text-error px-2 py-0.5 rounded-full">ADMIN</span>
          )
        }
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "전체 회원", value: members.length,                                           icon: "group",   color: "bg-primary-fixed text-primary-container" },
              { label: "가입 대기", value: pendingCount,                                              icon: "pending", color: "bg-error/10 text-error" },
              { label: "현역 회원", value: members.filter((m) => m.member_type === "current").length, icon: "school",  color: "bg-secondary-fixed text-on-secondary-fixed" },
              { label: "졸업생",   value: members.filter((m) => m.member_type === "alumni").length,   icon: "work",    color: "bg-tertiary-fixed text-on-tertiary-fixed-variant" },
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

          <div className="bg-surface-container-lowest rounded-2xl shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline font-bold text-on-surface">최근 가입 신청</h3>
              <button onClick={() => setActiveTab("pending")} className="text-sm text-primary-container font-semibold hover:underline flex items-center gap-1">
                전체보기 <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
            <div className="space-y-3">
              {pendingLoading ? (
                <div className="flex items-center justify-center py-6 text-on-surface-variant">
                  <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span>
                  불러오는 중...
                </div>
              ) : pendingMembers.length === 0 ? (
                <p className="text-sm text-on-surface-variant text-center py-6">대기 중인 가입 신청이 없습니다.</p>
              ) : (
                pendingMembers.slice(0, 3).map((p) => (
                  <div key={p.id} className="flex items-center justify-between py-2 border-b border-outline-variant/10 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center">
                        <span className="material-symbols-outlined text-base text-on-secondary-fixed-variant">person</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-on-surface">{p.name}</p>
                        <p className="text-xs text-on-surface-variant">
                          {p.department ?? "-"}{p.admission_year ? ` · ${p.admission_year}년 입학` : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => approveMember.mutate(p.id)}
                        className="px-3 py-1 bg-primary-container text-white text-xs font-bold rounded-full hover:opacity-80"
                      >
                        승인
                      </button>
                      <button
                        onClick={() => rejectMember.mutate(p.id)}
                        className="px-3 py-1 bg-error/10 text-error text-xs font-bold rounded-full hover:opacity-80"
                      >
                        거절
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: "announcement",  label: "공지 작성",  color: "bg-primary-fixed text-primary-container" },
              { icon: "photo_library", label: "사진첩 관리", color: "bg-secondary-fixed text-on-secondary-fixed" },
              { icon: "description",   label: "회칙 수정",  color: "bg-tertiary-fixed text-on-tertiary-fixed-variant" },
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

      {/* ── PENDING ── */}
      {activeTab === "pending" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-on-surface-variant">
              <span className="font-bold text-error">{pendingCount}건</span> 대기 중
            </p>
            {pendingCount > 0 && (
              <button
                onClick={() => approveAll.mutate()}
                disabled={approveAll.isPending}
                className="px-4 py-1.5 bg-primary-container text-white text-sm font-bold rounded-full hover:opacity-80 disabled:opacity-50"
              >
                전체 승인
              </button>
            )}
          </div>

          {pendingLoading ? (
            <div className="flex items-center justify-center py-16 text-on-surface-variant">
              <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span>
              불러오는 중...
            </div>
          ) : pendingMembers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant gap-3">
              <span className="material-symbols-outlined text-4xl">check_circle</span>
              <p className="text-sm">대기 중인 가입 신청이 없습니다.</p>
            </div>
          ) : (
            pendingMembers.map((p) => (
              <div key={p.id} className="bg-surface-container-lowest rounded-2xl p-5 shadow-card">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-2xl text-on-secondary-fixed-variant">person</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-on-surface">{p.name}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.member_type === "current" ? "bg-secondary-fixed text-on-secondary-fixed" : "bg-tertiary-fixed text-on-tertiary-fixed-variant"}`}>
                          {p.member_type === "current" ? "현역" : "졸업생"}
                        </span>
                      </div>
                      <p className="text-sm text-on-surface-variant mt-0.5">
                        {p.department ?? "-"}{p.admission_year ? ` · ${p.admission_year}년 입학` : ""}
                      </p>
                      <p className="text-xs text-on-surface-variant mt-0.5">{p.email}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">신청일시: {formatDate(p.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => approveMember.mutate(p.id)}
                      disabled={approveMember.isPending}
                      className="flex items-center gap-1.5 px-4 py-2 bg-primary-container text-white text-sm font-bold rounded-full hover:opacity-80 active:scale-95 transition-all disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-base">check_circle</span>승인
                    </button>
                    <button
                      onClick={() => rejectMember.mutate(p.id)}
                      disabled={rejectMember.isPending}
                      className="flex items-center gap-1.5 px-4 py-2 bg-error/10 text-error text-sm font-bold rounded-full hover:opacity-80 active:scale-95 transition-all disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-base">cancel</span>거절
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── MEMBERS ── */}
      {activeTab === "members" && (
        <div className="space-y-4">
          {isMockData && !membersLoading && (
            <div className="px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 flex items-center gap-2">
              <span className="material-symbols-outlined text-base">info</span>
              미리보기 데이터입니다. 실제 회원이 가입하면 자동으로 전환됩니다.
            </div>
          )}

          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">search</span>
              <input
                type="text"
                placeholder="이름, 학과 검색..."
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-surface-container-lowest rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary-container/30 shadow-card"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["전체", "현역", "졸업생", "운영진", "관리자"].map((f) => (
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

          {membersLoading ? (
            <div className="flex items-center justify-center py-16 text-on-surface-variant">
              <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span>
              불러오는 중...
            </div>
          ) : (
            <div className="bg-surface-container-lowest rounded-2xl shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-outline-variant/20 bg-surface-container/50">
                      <th className="text-left px-5 py-3 text-xs font-bold text-on-surface-variant">회원</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant hidden lg:table-cell">연락처</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant hidden md:table-cell">학과 / 기수</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant hidden md:table-cell">가입일</th>
                      <th className="text-center px-4 py-3 text-xs font-bold text-on-surface-variant">유형</th>
                      <th className="text-center px-4 py-3 text-xs font-bold text-on-surface-variant">권한</th>
                      <th className="text-center px-4 py-3 text-xs font-bold text-on-surface-variant">상태</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {filteredMembers.map((member) => {
                      const roleOptions = viewerRole ? assignableRoles(viewerRole, member.role) : [];
                      const canEdit = roleOptions.length > 0;

                      return (
                        <tr
                          key={member.id}
                          className={`hover:bg-primary-fixed/10 transition-colors ${member.status === "inactive" ? "opacity-50" : ""}`}
                        >
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center shrink-0">
                                <span className="text-sm font-bold text-on-secondary-fixed-variant">{member.name.charAt(0)}</span>
                              </div>
                              <div>
                                <p className="font-semibold text-on-surface">{member.name}</p>
                                {member.admission_year && (
                                  <p className="text-xs text-on-surface-variant">{member.admission_year}년 입학</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell">
                            <p className="text-xs text-on-surface">{member.email || "-"}</p>
                            <p className="text-xs text-on-surface-variant mt-0.5">{member.phone || "-"}</p>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <p className="text-on-surface">{member.department ?? "-"}</p>
                            <p className="text-xs text-on-surface-variant">{member.generation ?? "-"}</p>
                          </td>
                          <td className="px-4 py-3 text-xs text-on-surface-variant hidden md:table-cell">
                            {formatDate(member.created_at)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${member.member_type === "current" ? "bg-secondary-fixed text-on-secondary-fixed" : "bg-tertiary-fixed text-on-tertiary-fixed-variant"}`}>
                              {member.member_type === "current" ? "현역" : "졸업생"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {canEdit ? (
                              <select
                                value={member.role}
                                onChange={(e) => handleRoleChange(member.id, e.target.value as AppRole)}
                                className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-outline-variant/30 bg-surface-container-lowest text-on-surface outline-none cursor-pointer"
                              >
                                {roleOptions.map((r) => (
                                  <option key={r} value={r}>{ROLE_META[r].label}</option>
                                ))}
                              </select>
                            ) : (
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ROLE_META[member.role].color}`}>
                                {ROLE_META[member.role].label}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => handleStatusToggle(member.id, member.status as "active" | "inactive")}
                              disabled={isMockData || updateStatus.isPending}
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all hover:opacity-70 disabled:cursor-not-allowed ${member.status === "active" ? "bg-primary-fixed text-primary-container" : "bg-surface-container text-on-surface-variant"}`}
                            >
                              {member.status === "active" ? "활성" : "비활성"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </PageLayout>
  );
}
