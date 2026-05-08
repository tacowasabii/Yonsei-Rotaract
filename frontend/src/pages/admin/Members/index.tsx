import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import type { AppRole } from "@/api/types/member";
import { useMembers, useUpdateMemberRole, useUpdateMemberStatus } from "@/api/hooks/profiles/useMembers";
import MemberTable from "./components/MemberTable";
import LoadingState from "@components/admin/LoadingState";

type SortKey = "name" | "generation" | "admission_year";

const PAGE_SIZE = 15;

export default function AdminMembers() {
  const { role: viewerRole } = useAuth();
  const [memberSearch, setMemberSearch] = useState("");
  const [filterType, setFilterType] = useState("전체");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const { data: members = [], isLoading: membersLoading, isError } = useMembers();
  const updateRole = useUpdateMemberRole();
  const updateStatus = useUpdateMemberStatus();

  function handleSort(key: SortKey) {
    if (sortKey !== key) { setSortKey(key); setSortDir("asc"); }
    else if (sortDir === "asc") setSortDir("desc");
    else { setSortKey(null); setSortDir("asc"); }
    setPage(1);
  }

  function handleSearchChange(value: string) { setMemberSearch(value); setPage(1); }
  function handleFilterChange(value: string) { setFilterType(value); setPage(1); }
  function handleRoleChange(memberId: string, newRole: AppRole) { updateRole.mutate({ memberId, newRole }); }
  function handleStatusToggle(memberId: string, currentStatus: "active" | "inactive") {
    updateStatus.mutate({ memberId, newStatus: currentStatus === "active" ? "inactive" : "active" });
  }

  const filteredMembers = members
    .filter((m) => {
      if (m.role === "super_admin") return false;
      const matchSearch =
        !memberSearch ||
        m.name.includes(memberSearch) ||
        m.email.includes(memberSearch) ||
        (m.department ?? "").includes(memberSearch) ||
        (m.generation ?? "").includes(memberSearch) ||
        (m.phone ?? "").replace(/-/g, "").includes(memberSearch.replace(/-/g, "")) ||
        String(m.admission_year ?? "").includes(memberSearch);
      const matchType =
        filterType === "전체" ||
        (filterType === "현역"   && m.member_type === "current") ||
        (filterType === "졸업생" && m.member_type === "alumni") ||
        (filterType === "운영진" && m.role === "staff") ||
        (filterType === "관리자" && m.role === "admin");
      return matchSearch && matchType;
    })
    .sort((a, b) => {
      if (!sortKey) return 0;
      if (sortKey === "admission_year") {
        const av = a.admission_year ?? 0;
        const bv = b.admission_year ?? 0;
        return sortDir === "asc" ? av - bv : bv - av;
      }
      const av = sortKey === "name" ? a.name : (a.generation ?? "");
      const bv = sortKey === "name" ? b.name : (b.generation ?? "");
      return sortDir === "asc" ? av.localeCompare(bv, "ko") : bv.localeCompare(av, "ko");
    });

  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / PAGE_SIZE));
  const pagedMembers = filteredMembers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
            placeholder="이름, 학과, 기수, 학번, 연락처 검색..."
            value={memberSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-surface-container-lowest rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary-container/30 shadow-card"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["전체", "현역", "졸업생", "운영진", "관리자"].map((f) => (
            <button
              key={f}
              onClick={() => handleFilterChange(f)}
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
        <LoadingState />
      ) : (
        <MemberTable
          members={pagedMembers}
          viewerRole={viewerRole}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          onRoleChange={handleRoleChange}
          onStatusToggle={handleStatusToggle}
          updateStatusPending={updateStatus.isPending}
        />
      )}
    </div>
  );
}
