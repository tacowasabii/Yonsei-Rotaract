import { useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { isAdminOrAbove } from "../shared";
import { DeleteIcon } from "@assets/icons";
import Pagination from "@components/common/Pagination";

type DonationConfirmAction = {
  type: "approve" | "reject" | "delete-roster";
  id: string;
  name: string;
} | null;

interface DonationRecord {
  id: string;
  created_at: string;
  approved_at: string | null;
  is_anonymous: boolean;
  message: string | null;
  status: "pending" | "approved" | "rejected";
  is_hidden: boolean;
  profile: {
    name: string;
    department: string | null;
    admission_year: number | null;
    generation: string | null;
  };
}

const MOCK_PENDING: DonationRecord[] = [
  {
    id: "p1",
    created_at: "2025-04-20T09:00:00Z",
    approved_at: null,
    is_anonymous: false,
    message: "응원합니다! 항상 좋은 활동 해주세요.",
    status: "pending",
    is_hidden: false,
    profile: { name: "홍길동", department: "수학과", admission_year: 2021, generation: "36기" },
  },
  {
    id: "p2",
    created_at: "2025-04-21T11:30:00Z",
    approved_at: null,
    is_anonymous: true,
    message: null,
    status: "pending",
    is_hidden: false,
    profile: { name: "김철수", department: "물리학과", admission_year: 2022, generation: "37기" },
  },
  {
    id: "p3",
    created_at: "2025-04-22T14:00:00Z",
    approved_at: null,
    is_anonymous: false,
    message: "작은 보탬이 되길 바랍니다.",
    status: "pending",
    is_hidden: false,
    profile: { name: "이영희", department: "화학과", admission_year: 2020, generation: "35기" },
  },
];

const MOCK_REJECTED: DonationRecord[] = [
  {
    id: "r1",
    created_at: "2025-03-10T09:00:00Z",
    approved_at: null,
    is_anonymous: false,
    message: "응원합니다.",
    status: "rejected",
    is_hidden: false,
    profile: { name: "강민서", department: "영문학과", admission_year: 2023, generation: "38기" },
  },
  {
    id: "r2",
    created_at: "2025-03-18T14:00:00Z",
    approved_at: null,
    is_anonymous: true,
    message: null,
    status: "rejected",
    is_hidden: false,
    profile: { name: "오지훈", department: "경제학과", admission_year: 2022, generation: "37기" },
  },
];

const MOCK_APPROVED: DonationRecord[] = [
  {
    id: "a1",
    created_at: "2025-03-15T10:00:00Z",
    approved_at: "2025-03-16T10:00:00Z",
    is_anonymous: false,
    message: "로타랙트 화이팅!",
    status: "approved",
    is_hidden: false,
    profile: { name: "김민준", department: "경영학과", admission_year: 2020, generation: "35기" },
  },
  {
    id: "a2",
    created_at: "2025-03-20T10:00:00Z",
    approved_at: "2025-03-21T09:00:00Z",
    is_anonymous: true,
    message: "항상 응원합니다.",
    status: "approved",
    is_hidden: false,
    profile: { name: "박서준", department: "국문학과", admission_year: 2019, generation: "34기" },
  },
  {
    id: "a3",
    created_at: "2026-01-10T10:00:00Z",
    approved_at: "2026-01-12T10:00:00Z",
    is_anonymous: false,
    message: "올해도 함께합니다!",
    status: "approved",
    is_hidden: true,
    profile: { name: "정다은", department: "간호학과", admission_year: 2022, generation: "37기" },
  },
  {
    id: "a4",
    created_at: "2026-02-05T10:00:00Z",
    approved_at: "2026-02-06T10:00:00Z",
    is_anonymous: false,
    message: null,
    status: "approved",
    is_hidden: false,
    profile: { name: "한승우", department: "전기전자공학과", admission_year: 2021, generation: "36기" },
  },
];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function getYear(dateStr: string) {
  return new Date(dateStr).getFullYear();
}

type Tab = "pending" | "rejected" | "roster";

export default function AdminDonations() {
  const { role } = useAuth();
  const canManage = isAdminOrAbove(role);

  const [tab, setTab] = useState<Tab>("roster");
  const [pendingList, setPendingList] = useState(MOCK_PENDING);
  const [rejectedList, setRejectedList] = useState(MOCK_REJECTED);
  const [rosterList, setRosterList] = useState(MOCK_APPROVED);
  const [confirmAction, setConfirmAction] = useState<DonationConfirmAction>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  useOutsideClick(modalRef, () => setConfirmAction(null));

  const rosterYears = Array.from(
    new Set(rosterList.map((d) => getYear(d.approved_at!)))
  ).sort((a, b) => b - a);

  const [selectedYear, setSelectedYear] = useState(
    rosterYears[0] ?? new Date().getFullYear()
  );

  function handleApprove(id: string) {
    const target = pendingList.find((d) => d.id === id);
    if (!target) return;
    setPendingList((prev) => prev.filter((d) => d.id !== id));
    const approved = { ...target, status: "approved" as const, approved_at: new Date().toISOString() };
    setRosterList((prev) => [approved, ...prev]);
    const newYear = getYear(approved.approved_at!);
    setSelectedYear(newYear);
  }

  function handleReject(id: string) {
    const target = pendingList.find((d) => d.id === id);
    if (!target) return;
    setPendingList((prev) => prev.filter((d) => d.id !== id));
    setRejectedList((prev) => [{ ...target, status: "rejected" as const }, ...prev]);
  }

  function handleToggleHidden(id: string) {
    setRosterList((prev) =>
      prev.map((d) => (d.id === id ? { ...d, is_hidden: !d.is_hidden } : d))
    );
  }

  function handleDeleteRoster(id: string) {
    setRosterList((prev) => prev.filter((d) => d.id !== id));
  }

  function handleConfirm() {
    if (!confirmAction) return;
    if (confirmAction.type === "approve") handleApprove(confirmAction.id);
    else if (confirmAction.type === "reject") handleReject(confirmAction.id);
    else if (confirmAction.type === "delete-roster") handleDeleteRoster(confirmAction.id);
    setConfirmAction(null);
  }

  const filteredRoster = rosterList.filter(
    (d) => getYear(d.approved_at!) === selectedYear
  );

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "roster", label: "후원자 명단", count: rosterList.length },
    { key: "pending", label: "대기 중", count: pendingList.length },
    { key: "rejected", label: "거절", count: rejectedList.length },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-black font-headline text-on-surface">
          후원자 관리
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          후원 신청을 검토하고 명예의 전당 명단을 관리하세요
        </p>
      </div>

      {/* 탭 */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === t.key
                ? "bg-primary-container text-white"
                : "bg-surface-container-lowest text-on-surface-variant shadow-card hover:bg-primary-fixed/20"
            }`}
          >
            {t.label}
            {t.key !== "roster" && (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  tab === t.key
                    ? "bg-white/20 text-white"
                    : "bg-surface-container text-on-surface-variant"
                }`}
              >
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 대기 중 탭 */}
      {tab === "pending" && (
        <DonationTable
          list={pendingList}
          emptyMessage="대기 중인 신청이 없습니다"
          actions={(d) => canManage ? (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setConfirmAction({ type: "approve", id: d.id, name: d.profile.name })}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-primary-fixed text-primary-container hover:bg-primary-container hover:text-white transition-all"
              >
                승인
              </button>
              <button
                onClick={() => setConfirmAction({ type: "reject", id: d.id, name: d.profile.name })}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-surface-container text-on-surface-variant hover:bg-error/10 hover:text-error transition-all"
              >
                거절
              </button>
            </div>
          ) : null}
        />
      )}

      {/* 거절 탭 */}
      {tab === "rejected" && (
        <DonationTable
          list={rejectedList}
          emptyMessage="거절된 신청이 없습니다"
          actions={() => null}
        />
      )}

      {/* 확인 모달 */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div ref={modalRef} className="bg-surface-container-lowest rounded-3xl p-6 shadow-xl w-full max-w-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${confirmAction.type === "approve" ? "bg-primary-container/20" : "bg-error/10"}`}>
                <span className={`material-symbols-outlined text-xl ${confirmAction.type === "approve" ? "text-primary-container" : "text-error"}`}>
                  {confirmAction.type === "approve" ? "check_circle" : confirmAction.type === "reject" ? "cancel" : "delete"}
                </span>
              </div>
              <h2 className="font-headline font-bold text-on-surface text-lg">
                {confirmAction.type === "approve" ? "후원 승인" : confirmAction.type === "reject" ? "후원 거절" : "명단 삭제"}
              </h2>
            </div>
            <p className="text-sm text-on-surface-variant mb-6">
              <span className="font-bold text-on-surface">{confirmAction.name}</span>
              {confirmAction.type === "approve" && "님의 후원 신청을 승인하시겠습니까?"}
              {confirmAction.type === "reject" && "님의 후원 신청을 거절하시겠습니까?"}
              {confirmAction.type === "delete-roster" && "님을 후원자 명단에서 삭제하시겠습니까?"}
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 text-sm font-bold text-on-surface-variant rounded-full hover:bg-surface-container transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleConfirm}
                className={`px-5 py-2 text-sm font-bold rounded-full transition-all ${
                  confirmAction.type === "approve"
                    ? "bg-primary-container text-white hover:opacity-80"
                    : "bg-error text-white hover:opacity-80"
                }`}
              >
                {confirmAction.type === "approve" ? "승인" : confirmAction.type === "reject" ? "거절" : "삭제"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 후원자 명단 탭 */}
      {tab === "roster" && (
        <div className="space-y-4">
          {/* 연도 필터 */}
          {rosterYears.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {rosterYears.map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                    selectedYear === year
                      ? "bg-primary-container text-white"
                      : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  {year}년
                </button>
              ))}
            </div>
          )}

          <DonationTable
            key={selectedYear}
            list={filteredRoster}
            emptyMessage={`${selectedYear}년 후원자 명단이 없습니다`}
            showApprovedAt
            showVisibility
            onToggleHidden={handleToggleHidden}
            actions={(d) => canManage ? (
              <div className="flex items-center justify-center">
                <button
                  onClick={() => setConfirmAction({ type: "delete-roster", id: d.id, name: d.profile.name })}
                  className="p-1.5 rounded-lg text-on-surface-variant hover:bg-error/10 hover:text-error transition-all"
                  title="삭제"
                >
                  <DeleteIcon className="w-4 h-4" />
                </button>
              </div>
            ) : null}
          />
        </div>
      )}
    </div>
  );
}

const PAGE_SIZE = 15;

function DonationTable({
  list,
  emptyMessage,
  showApprovedAt = false,
  showVisibility = false,
  onToggleHidden,
  actions,
}: {
  list: DonationRecord[];
  emptyMessage: string;
  showApprovedAt?: boolean;
  showVisibility?: boolean;
  onToggleHidden?: (id: string) => void;
  actions: (d: DonationRecord) => React.ReactNode;
}) {
  const [page, setPage] = useState(1);
  const sorted = [...list].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant gap-2">
        <span className="material-symbols-outlined text-4xl">inbox</span>
        <p className="text-sm font-semibold">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
    <div className="bg-surface-container-lowest rounded-2xl shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-outline-variant/20 bg-surface-container/50">
              <th className="text-left px-5 py-3 text-xs font-bold text-on-surface-variant">
                신청일
              </th>
              <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant">
                이름
              </th>
              <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant hidden md:table-cell">
                학과 · 기수
              </th>
              <th className="text-center px-4 py-3 text-xs font-bold text-on-surface-variant">
                익명
              </th>
              <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant hidden lg:table-cell">
                메시지
              </th>
              {showApprovedAt && (
                <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant hidden md:table-cell">
                  승인일
                </th>
              )}
              {showVisibility && (
                <th className="text-center px-4 py-3 text-xs font-bold text-on-surface-variant">
                  공개 여부
                </th>
              )}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {paged.map((d) => (
              <tr
                key={d.id}
                className="hover:bg-primary-fixed/10 transition-colors"
              >
                <td className="px-5 py-3 text-xs text-on-surface-variant whitespace-nowrap">
                  {formatDate(d.created_at)}
                </td>
                <td className="px-4 py-3 font-semibold text-on-surface">
                  {d.profile.name}
                </td>
                <td className="px-4 py-3 text-xs text-on-surface-variant hidden md:table-cell">
                  {[
                    d.profile.department,
                    d.profile.admission_year
                      ? `${String(d.profile.admission_year).slice(-2)}학번`
                      : null,
                    d.profile.generation,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
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
                      onClick={() => onToggleHidden?.(d.id)}
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
                <td className="px-4 py-3">{actions(d)}</td>
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
