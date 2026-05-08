import Pagination from "@components/common/Pagination";
import MemberTypeBadge from "@components/common/MemberTypeBadge";
import { formatDate, formatPhone } from "../../shared";
import type { PendingMember, RejectedMember } from "@/api/types/member";
import { useState } from "react";

const PAGE_SIZE = 15;

interface PendingTableProps {
  members: (PendingMember | RejectedMember)[];
  canApprove: boolean;
  onAction?: (type: "approve" | "reject", id: string, name: string) => void;
}

export default function PendingTable({ members, canApprove, onAction }: PendingTableProps) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(members.length / PAGE_SIZE));
  const paged = members.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-4">
      <div className="bg-surface-container-lowest rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-outline-variant/20 bg-surface-container/50">
                <th className="text-left px-5 py-3 text-xs font-bold text-on-surface-variant">신청일</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant">이름</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant hidden md:table-cell">학과</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant hidden md:table-cell">학번</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant hidden md:table-cell">기수</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant hidden lg:table-cell">연락처</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-on-surface-variant hidden sm:table-cell">유형</th>
                {canApprove && onAction && <th className="px-4 py-3" />}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {paged.map((p) => (
                <tr key={p.id} className="hover:bg-primary-fixed/10 transition-colors">
                  <td className="px-5 py-3 text-xs text-on-surface-variant whitespace-nowrap">
                    {formatDate(p.created_at)}
                  </td>
                  <td className="px-4 py-3 font-semibold text-on-surface">{p.name}</td>
                  <td className="px-4 py-3 text-sm text-on-surface hidden md:table-cell">
                    {p.department ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-on-surface-variant hidden md:table-cell">
                    {p.admission_year ? `${String(p.admission_year).slice(-2)}학번` : "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-on-surface-variant hidden md:table-cell">
                    {p.generation ?? "-"}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <p className="text-xs text-on-surface">{p.email || "-"}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">{formatPhone(p.phone)}</p>
                  </td>
                  <td className="px-4 py-3 text-center hidden sm:table-cell">
                    {p.member_type && <MemberTypeBadge memberType={p.member_type} />}
                  </td>
                  {canApprove && onAction && (
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onAction("approve", p.id, p.name)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-primary-fixed text-primary-container hover:bg-primary-container hover:text-white transition-all"
                        >
                          승인
                        </button>
                        <button
                          onClick={() => onAction("reject", p.id, p.name)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-surface-container text-on-surface-variant hover:bg-error/10 hover:text-error transition-all"
                        >
                          거절
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
