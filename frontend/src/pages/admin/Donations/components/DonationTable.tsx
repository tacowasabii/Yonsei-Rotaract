import Pagination from "@components/common/Pagination";
import LoadingState from "@components/admin/LoadingState";
import EmptyState from "@components/admin/EmptyState";
import { formatDate } from "../../shared";
import type { DonationRecord } from "@/api/types/donation";

const PAGE_SIZE = 15;

interface DonationTableProps {
  list: DonationRecord[];
  total: number;
  page: number;
  onPageChange: (p: number) => void;
  loading: boolean;
  emptyMessage: string;
  showApprovedAt?: boolean;
  showVisibility?: boolean;
  showActionsColumn?: boolean;
  onToggleHidden?: (id: string, current: boolean) => void;
  actions: (d: DonationRecord) => React.ReactNode;
}

export default function DonationTable({
  list,
  total,
  page,
  onPageChange,
  loading,
  emptyMessage,
  showApprovedAt = false,
  showVisibility = false,
  showActionsColumn = false,
  onToggleHidden,
  actions,
}: DonationTableProps) {
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  if (loading) return <LoadingState />;
  if (list.length === 0) return <EmptyState message={emptyMessage} />;

  return (
    <div className="space-y-4">
      <div className="bg-surface-container-lowest rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-outline-variant/20 bg-surface-container/50">
                <th className="text-left px-5 py-3 text-xs font-bold text-on-surface-variant">신청일</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant">이름</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant hidden md:table-cell">
                  학과 · 기수
                </th>
                <th className="text-center px-4 py-3 text-xs font-bold text-on-surface-variant">익명</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant hidden lg:table-cell">
                  메시지
                </th>
                {showApprovedAt && (
                  <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant hidden md:table-cell">
                    승인일
                  </th>
                )}
                {showVisibility && (
                  <th className="text-center px-4 py-3 text-xs font-bold text-on-surface-variant">공개 여부</th>
                )}
                {showActionsColumn && <th className="px-4 py-3" />}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {list.map((d) => (
                <tr key={d.id} className="hover:bg-primary-fixed/10 transition-colors">
                  <td className="px-5 py-3 text-xs text-on-surface-variant whitespace-nowrap">
                    {formatDate(d.created_at)}
                  </td>
                  <td className="px-4 py-3 font-semibold text-on-surface">{d.profiles?.name ?? "-"}</td>
                  <td className="px-4 py-3 text-xs text-on-surface-variant hidden md:table-cell">
                    {[
                      d.profiles?.department,
                      d.profiles?.admission_year
                        ? `${String(d.profiles.admission_year).slice(-2)}학번`
                        : null,
                      d.profiles?.generation,
                    ]
                      .filter(Boolean)
                      .join(" · ") || "-"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {d.is_anonymous ? (
                      <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
                        익명
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-fixed text-primary-container">
                        실명
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-on-surface-variant hidden lg:table-cell max-w-xs">
                    {d.message ? (
                      <span className="line-clamp-1">{d.message}</span>
                    ) : (
                      <span className="text-outline-variant">-</span>
                    )}
                  </td>
                  {showApprovedAt && (
                    <td className="px-4 py-3 text-xs text-on-surface-variant hidden md:table-cell whitespace-nowrap">
                      {d.approved_at ? formatDate(d.approved_at) : "-"}
                    </td>
                  )}
                  {showVisibility && (
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => onToggleHidden?.(d.id, d.is_hidden)}
                        className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full transition-all hover:opacity-70 ${
                          d.is_hidden
                            ? "bg-surface-container text-on-surface-variant"
                            : "bg-primary-fixed text-primary-container"
                        }`}
                      >
                        {d.is_hidden ? "비공개" : "공개"}
                      </button>
                    </td>
                  )}
                  {showActionsColumn && <td className="px-4 py-3">{actions(d)}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination page={page} totalPages={totalPages} onChange={onPageChange} />
    </div>
  );
}
