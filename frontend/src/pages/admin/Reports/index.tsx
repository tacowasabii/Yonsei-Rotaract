import { useState } from "react";
import Pagination from "@components/common/Pagination";
import ModalLayout from "@components/common/ModalLayout";
import { formatDateTime } from "@/utils/date";
import { CloseIcon } from "@assets/icons";

type Tab = "pending" | "resolved";
type ReportStatus = "pending" | "resolved";

interface MockReport {
  id: string;
  reporter: string;
  title: string;
  content: string;
  created_at: string;
  status: ReportStatus;
}

const initialReports: MockReport[] = [
  {
    id: "1",
    reporter: "김민준",
    title: "욕설 및 비하 발언",
    content: "게시판에서 특정 사용자를 지속적으로 비하하는 댓글을 작성하고 있습니다.",
    created_at: "2025-05-01T10:23:00Z",
    status: "pending",
  },
  {
    id: "2",
    reporter: "이서연",
    title: "허위 정보 게시",
    content: "사실과 다른 동아리 관련 정보를 게시글로 올리고 있습니다.",
    created_at: "2025-05-03T14:11:00Z",
    status: "resolved",
  },
  {
    id: "3",
    reporter: "박지호",
    title: "스팸성 게시물",
    content: "동일한 내용의 게시글을 여러 게시판에 반복적으로 올리고 있습니다.",
    created_at: "2025-05-05T09:47:00Z",
    status: "pending",
  },
];

const tabs: { key: Tab; label: string }[] = [
  { key: "pending",  label: "대기 중" },
  { key: "resolved", label: "처리 완료" },
];

const PAGE_SIZE = 15;

export default function AdminReports() {
  const [tab, setTab] = useState<Tab>("pending");
  const [page, setPage] = useState(1);
  const [reports, setReports] = useState<MockReport[]>(initialReports);
  const [selected, setSelected] = useState<MockReport | null>(null);

  function handleTabChange(key: Tab) {
    setTab(key);
    setPage(1);
  }

  function toggleStatus(id: string) {
    setReports(prev =>
      prev.map(r =>
        r.id === id
          ? { ...r, status: r.status === "pending" ? "resolved" : "pending" }
          : r
      )
    );
    setSelected(prev =>
      prev ? { ...prev, status: prev.status === "pending" ? "resolved" : "pending" } : null
    );
  }

  const filtered = reports.filter((r) => r.status === tab);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-black text-on-surface font-headline">신고 관리</h1>
        <p className="text-sm text-on-surface-variant mt-1">접수된 신고 내역을 조회하고 처리합니다.</p>
      </div>

      {/* 탭 */}
      <div className="flex gap-1 bg-surface-container rounded-xl p-1 w-fit">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => handleTabChange(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              tab === t.key
                ? "bg-white text-on-surface shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-outline-variant/30 bg-surface-container/50">
              <th className="text-left px-5 py-3.5 text-xs font-bold text-on-surface-variant">신고자</th>
              <th className="text-left px-5 py-3.5 text-xs font-bold text-on-surface-variant">제목</th>
              <th className="text-left px-5 py-3.5 text-xs font-bold text-on-surface-variant">내용</th>
              <th className="text-left px-5 py-3.5 text-xs font-bold text-on-surface-variant">접수일</th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-16 text-sm text-on-surface-variant">
                  신고 내역이 없습니다.
                </td>
              </tr>
            ) : (
              paged.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => setSelected(r)}
                  className="border-b border-outline-variant/20 last:border-0 hover:bg-surface-container/30 transition-colors cursor-pointer"
                >
                  <td className="px-5 py-4 text-sm font-semibold text-on-surface whitespace-nowrap">{r.reporter}</td>
                  <td className="px-5 py-4 text-sm text-on-surface">{r.title}</td>
                  <td className="px-5 py-4 text-sm text-on-surface-variant max-w-xs truncate">{r.content}</td>
                  <td className="px-5 py-4 text-sm text-on-surface-variant whitespace-nowrap">{formatDateTime(r.created_at)}</td>
                  <td className="px-5 py-4 text-right">
                    {r.status === "pending" ? (
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleStatus(r.id); }}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-primary text-white hover:opacity-90 transition-opacity"
                      >
                        처리 완료
                      </button>
                    ) : (
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleStatus(r.id); }}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors"
                      >
                        되돌리기
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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
            <span>신고자: <strong className="text-on-surface">{selected.reporter}</strong></span>
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
