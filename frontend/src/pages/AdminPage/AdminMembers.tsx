import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import type { AppRole } from "@/api/types/member";
import { useMembers, useUpdateMemberRole, useUpdateMemberStatus } from "@/api/hooks/useMembers";
import { ROLE_META, assignableRoles, formatDate, isAdminOrAbove } from "./shared";

export default function AdminMembers() {
  const { role: viewerRole } = useAuth();
  const [memberSearch, setMemberSearch] = useState("");
  const [filterType, setFilterType] = useState("전체");
  const [sortKey, setSortKey] = useState<"name" | "generation" | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const handleSort = (key: "name" | "generation") => {
    if (sortKey !== key) { setSortKey(key); setSortDir("asc"); }
    else if (sortDir === "asc") setSortDir("desc");
    else { setSortKey(null); setSortDir("asc"); }
  };

  const { data: members = [], isLoading: membersLoading, isError } = useMembers();
  const updateRole = useUpdateMemberRole();
  const updateStatus = useUpdateMemberStatus();

  const handleRoleChange = (memberId: string, newRole: AppRole) => {
    updateRole.mutate({ memberId, newRole });
  };

  const handleStatusToggle = (memberId: string, currentStatus: "active" | "inactive") => {
    updateStatus.mutate({ memberId, newStatus: currentStatus === "active" ? "inactive" : "active" });
  };

  const sortIcon = (key: "name" | "generation") => {
    if (sortKey !== key) return "unfold_more";
    return sortDir === "asc" ? "arrow_upward" : "arrow_downward";
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
  }).sort((a, b) => {
    if (!sortKey) return 0;
    const av = sortKey === "name" ? a.name : (a.generation ?? "");
    const bv = sortKey === "name" ? b.name : (b.generation ?? "");
    return sortDir === "asc" ? av.localeCompare(bv, "ko") : bv.localeCompare(av, "ko");
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-black font-headline text-on-surface">회원 관리</h1>
        <p className="text-sm text-on-surface-variant mt-1">회원 권한 및 상태 관리</p>
      </div>

      {isError && (
        <div className="px-4 py-2.5 bg-error/10 border border-error/20 rounded-xl text-xs text-error flex items-center gap-2">
          <span className="material-symbols-outlined text-base">error</span>
          회원 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
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
                  <th className="text-left px-5 py-3 text-xs font-bold text-on-surface-variant">
                    <button onClick={() => handleSort("name")} className="flex items-center gap-0.5 hover:text-on-surface transition-colors">
                      이름 <span className="material-symbols-outlined text-sm">{sortIcon("name")}</span>
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant hidden lg:table-cell">연락처</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant hidden md:table-cell">학과</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant hidden md:table-cell">
                    <button onClick={() => handleSort("generation")} className="flex items-center gap-0.5 hover:text-on-surface transition-colors">
                      기수 <span className="material-symbols-outlined text-sm">{sortIcon("generation")}</span>
                    </button>
                  </th>
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
                      <td className="px-4 py-3 hidden md:table-cell text-sm text-on-surface">
                        {member.department ?? "-"}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-sm text-on-surface-variant">
                        {member.generation ?? "-"}
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
                        {isAdminOrAbove(viewerRole) ? (
                          <button
                            onClick={() => handleStatusToggle(member.id, member.status as "active" | "inactive")}
                            disabled={updateStatus.isPending}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all hover:opacity-70 disabled:cursor-not-allowed ${member.status === "active" ? "bg-primary-fixed text-primary-container" : "bg-surface-container text-on-surface-variant"}`}
                          >
                            {member.status === "active" ? "활성" : "비활성"}
                          </button>
                        ) : (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${member.status === "active" ? "bg-primary-fixed text-primary-container" : "bg-surface-container text-on-surface-variant"}`}>
                            {member.status === "active" ? "활성" : "비활성"}
                          </span>
                        )}
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
