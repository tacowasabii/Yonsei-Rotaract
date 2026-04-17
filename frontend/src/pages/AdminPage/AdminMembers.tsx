import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import type { AppRole } from "@/api/types/member";
import { useMembers, useUpdateMemberRole, useUpdateMemberStatus } from "@/api/hooks/useMembers";
import { MOCK_MEMBERS, ROLE_META, assignableRoles, formatDate } from "./shared";

export default function AdminMembers() {
  const { role: viewerRole } = useAuth();
  const [memberSearch, setMemberSearch] = useState("");
  const [filterType, setFilterType] = useState("전체");

  const { data: fetchedMembers, isLoading: membersLoading } = useMembers();
  const updateRole = useUpdateMemberRole();
  const updateStatus = useUpdateMemberStatus();

  const isMockData = !fetchedMembers || fetchedMembers.length === 0;
  const members = isMockData ? MOCK_MEMBERS : fetchedMembers;

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

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-black font-headline text-on-surface">회원 관리</h1>
        <p className="text-sm text-on-surface-variant mt-1">회원 권한 및 상태 관리</p>
      </div>

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
  );
}
