import { useState } from "react";
import Pagination from "@components/common/Pagination";
import ModalLayout from "@components/common/ModalLayout";
import { formatDateTime } from "@/utils/date";
import { CloseIcon } from "@assets/icons";
import { useReports, useResolveReport, useRevertReport } from "@/api/hooks/reports/useReports";
import { useIsAdmin } from "@/contexts/AuthContext";
import type { ReportRow } from "@/api/reports";
import AdminTabBar from "@components/admin/AdminTabBar";

type Tab = "pending" | "resolved";

const tabs: { key: Tab; label: string }[] = [
  { key: "pending",  label: "대기 중" },
  { key: "resolved", label: "처리 완료" },
];

const PAGE_SIZE = 15;

export default function AdminReports() {
  const [tab, setTab] = useState<Tab>("pending");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<ReportRow | null>(null);

  const isAdmin = useIsAdmin();
  const { data, isLoading } = useReports(tab, page);
  const { mutate: resolve } = useResolveReport();
  const { mutate: revert } = useRevertReport();

  const reports = data?.data ?? [];
  const totalPages = Math.ceil((data?.count ?? 0) / PAGE_SIZE);

  function handleTabChange(key: Tab) {
    setTab(key);
    setPage(1);
    setSelected(null);
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-black text-on-surface font-headline">신고 관리</h1>
        <p className="text-sm text-on-surface-variant mt-1">접수된 신고 내역을 조회하고 처리합니다.</p>
      </div>

      <AdminTabBar tabs={tabs} activeTab={tab} onChange={handleTabChange} variant="segment" />

      {/* 테이블 */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full min-w-max text-sm">
          <thead>
            <tr className="border-b border-outline-variant/20 bg-surface-container/50">
              <th className="text-left px-5 py-3 text-xs font-bold text-on-surface-variant whitespace-nowrap">신고자</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-on-surface-variant whitespace-nowrap">제목</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-on-surface-variant whitespace-nowrap">내용</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-on-surface-variant whitespace-nowrap">접수일</th>
              {isAdmin && <th className="px-5 py-3" />}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-16 text-sm text-on-surface-variant">
                  불러오는 중...
                </td>
              </tr>
            ) : reports.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-16 text-sm text-on-surface-variant">
                  신고 내역이 없습니다.
                </td>
              </tr>
            ) : (
              reports.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => setSelected(r)}
                  className="hover:bg-primary-fixed/10 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-2.5 font-semibold text-on-surface whitespace-nowrap">
                    {r.profiles?.name ?? "알 수 없음"}
                  </td>
                  <td className="px-4 py-2.5 text-on-surface">{r.title}</td>
                  <td className="px-4 py-2.5 text-on-surface-variant max-w-xs truncate">{r.content}</td>
                  <td className="px-4 py-2.5 text-on-surface-variant whitespace-nowrap">{formatDateTime(r.created_at)}</td>
                  {isAdmin && (
                    <td className="px-4 py-2.5 text-right">
                      {r.status === "pending" ? (
                        <button
                          onClick={(e) => { e.stopPropagation(); resolve(r.id); }}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-primary-fixed text-primary-container hover:bg-primary-container hover:text-white transition-all"
                        >
                          처리 완료
                        </button>
                      ) : (
                        <button
                          onClick={(e) => { e.stopPropagation(); revert(r.id); }}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors"
                        >
                          되돌리기
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      {/* 상세 모달 */}
      {selected && (
        <ModalLayout onClose={() => setSelected(null)} variant="form">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-on-surface">신고 상세</h2>
            <button
              onClick={() => setSelected(null)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors"
            >
              <CloseIcon className="w-5 h-5 text-on-surface-variant" />
            </button>
          </div>

          <div className="flex gap-6 text-sm text-on-surface-variant">
            <span>신고자: <strong className="text-on-surface">{selected.profiles?.name ?? "알 수 없음"}</strong></span>
            <span>접수일: <strong className="text-on-surface">{formatDateTime(selected.created_at)}</strong></span>
          </div>

          <hr className="border-outline-variant/30" />

          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-on-surface-variant mb-1">제목</p>
              <p className="text-sm text-on-surface">{selected.title}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant mb-1">내용</p>
              <p className="text-sm text-on-surface whitespace-pre-wrap">{selected.content}</p>
            </div>
          </div>
        </ModalLayout>
      )}
    </div>
  );
}
