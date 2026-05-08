import type { AppRole } from "@/api/types/member";
import { ROLE_LABELS, assignableRoles, formatDate, formatPhone, isAdminOrAbove } from "../../shared";
import SortHeaderButton from "./SortHeaderButton";
import RoleBadge from "@components/common/RoleBadge";
import MemberTypeBadge from "@components/common/MemberTypeBadge";
import Pagination from "@components/common/Pagination";

type SortKey = "name" | "generation" | "admission_year";

interface Member {
  id: string;
  name: string;
  email: string;
  department: string | null;
  admission_year: number | null;
  generation: string | null;
  phone: string | null;
  created_at: string;
  member_type: string | null;
  role: AppRole;
  status: string;
}

interface MemberTableProps {
  members: Member[];
  viewerRole: AppRole | null;
  sortKey: SortKey | null;
  sortDir: "asc" | "desc";
  onSort: (key: SortKey) => void;
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  onRoleChange: (memberId: string, newRole: AppRole) => void;
  onStatusToggle: (memberId: string, currentStatus: "active" | "inactive") => void;
  updateStatusPending: boolean;
}

export default function MemberTable({
  members,
  viewerRole,
  sortKey,
  sortDir,
  onSort,
  page,
  totalPages,
  onPageChange,
  onRoleChange,
  onStatusToggle,
  updateStatusPending,
}: MemberTableProps) {
  return (
    <>
      <div className="bg-surface-container-lowest rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-outline-variant/20 bg-surface-container/50">
                <th className="text-left px-5 py-3 text-xs font-bold text-on-surface-variant">
                  <SortHeaderButton label="이름" sortKey="name" activeSortKey={sortKey} sortDir={sortDir} onSort={() => onSort("name")} />
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant hidden md:table-cell">학과</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant hidden md:table-cell">
                  <SortHeaderButton label="학번" sortKey="admission_year" activeSortKey={sortKey} sortDir={sortDir} onSort={() => onSort("admission_year")} />
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant hidden md:table-cell">
                  <SortHeaderButton label="기수" sortKey="generation" activeSortKey={sortKey} sortDir={sortDir} onSort={() => onSort("generation")} />
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant hidden lg:table-cell">연락처</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant hidden md:table-cell">가입일</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-on-surface-variant">유형</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-on-surface-variant">권한</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-on-surface-variant">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {members.map((member) => {
                const roleOptions = viewerRole ? assignableRoles(viewerRole, member.role) : [];
                const canEdit = roleOptions.length > 0;

                return (
                  <tr
                    key={member.id}
                    className={`hover:bg-primary-fixed/10 transition-colors ${member.status === "inactive" ? "opacity-50" : ""}`}
                  >
                    <td className="px-5 py-3 font-semibold text-on-surface">{member.name}</td>
                    <td className="px-4 py-3 hidden md:table-cell text-sm text-on-surface">
                      {member.department ?? "-"}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-sm text-on-surface-variant">
                      {member.admission_year ? `${String(member.admission_year).slice(-2)}학번` : "-"}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-sm text-on-surface-variant">
                      {member.generation ?? "-"}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <p className="text-xs text-on-surface">{member.email || "-"}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">{formatPhone(member.phone)}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-on-surface-variant hidden md:table-cell">
                      {formatDate(member.created_at)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <MemberTypeBadge memberType={member.member_type} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      {canEdit ? (
                        <select
                          value={member.role}
                          onChange={(e) => onRoleChange(member.id, e.target.value as AppRole)}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-outline-variant/30 bg-surface-container-lowest text-on-surface outline-none cursor-pointer"
                        >
                          {roleOptions.map((r) => (
                            <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                          ))}
                        </select>
                      ) : (
                        <RoleBadge role={member.role} showAll />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {isAdminOrAbove(viewerRole) ? (
                        <button
                          onClick={() => onStatusToggle(member.id, member.status as "active" | "inactive")}
                          disabled={updateStatusPending}
                          className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full transition-all hover:opacity-70 disabled:cursor-not-allowed ${
                            member.status === "active"
                              ? "bg-primary-fixed text-primary-container"
                              : "bg-surface-container text-on-surface-variant"
                          }`}
                        >
                          {member.status === "active" ? "활성" : "비활성"}
                        </button>
                      ) : (
                        <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          member.status === "active"
                            ? "bg-primary-fixed text-primary-container"
                            : "bg-surface-container text-on-surface-variant"
                        }`}>
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
      <Pagination page={page} totalPages={totalPages} onChange={onPageChange} />
    </>
  );
}
