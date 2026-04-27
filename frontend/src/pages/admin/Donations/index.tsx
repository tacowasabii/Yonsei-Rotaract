import { useState } from "react";

interface DonationRecord {
  id: string;
  created_at: string;
  approved_at: string | null;
  is_anonymous: boolean;
  message: string | null;
  status: "pending" | "approved" | "rejected";
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
    profile: { name: "홍길동", department: "수학과", admission_year: 2021, generation: "36기" },
  },
  {
    id: "p2",
    created_at: "2025-04-21T11:30:00Z",
    approved_at: null,
    is_anonymous: true,
    message: null,
    status: "pending",
    profile: { name: "김철수", department: "물리학과", admission_year: 2022, generation: "37기" },
  },
  {
    id: "p3",
    created_at: "2025-04-22T14:00:00Z",
    approved_at: null,
    is_anonymous: false,
    message: "작은 보탬이 되길 바랍니다.",
    status: "pending",
    profile: { name: "이영희", department: "화학과", admission_year: 2020, generation: "35기" },
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
    profile: { name: "김민준", department: "경영학과", admission_year: 2020, generation: "35기" },
  },
  {
    id: "a2",
    created_at: "2025-03-20T10:00:00Z",
    approved_at: "2025-03-21T09:00:00Z",
    is_anonymous: true,
    message: "항상 응원합니다.",
    status: "approved",
    profile: { name: "박서준", department: "국문학과", admission_year: 2019, generation: "34기" },
  },
];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

type Tab = "pending" | "approved";

export default function AdminDonations() {
  const [tab, setTab] = useState<Tab>("pending");
  const [pendingList, setPendingList] = useState(MOCK_PENDING);
  const [approvedList, setApprovedList] = useState(MOCK_APPROVED);

  function handleApprove(id: string) {
    const target = pendingList.find((d) => d.id === id);
    if (!target) return;
    setPendingList((prev) => prev.filter((d) => d.id !== id));
    setApprovedList((prev) => [
      { ...target, status: "approved" as const, approved_at: new Date().toISOString() },
      ...prev,
    ]);
  }

  function handleReject(id: string) {
    setPendingList((prev) => prev.filter((d) => d.id !== id));
  }

  const list = tab === "pending" ? pendingList : approvedList;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-black font-headline text-on-surface">
          후원 관리
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          후원 신청을 확인하고 명예의 전당 등록을 승인하세요
        </p>
      </div>

      {/* 탭 */}
      <div className="flex gap-2">
        {(["pending", "approved"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === t
                ? "bg-primary-container text-white"
                : "bg-surface-container-lowest text-on-surface-variant shadow-card hover:bg-primary-fixed/20"
            }`}
          >
            {t === "pending" ? "대기 중" : "승인 완료"}
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                tab === t ? "bg-white/20 text-white" : "bg-surface-container text-on-surface-variant"
              }`}
            >
              {t === "pending" ? pendingList.length : approvedList.length}
            </span>
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant gap-2">
          <span className="material-symbols-outlined text-4xl">inbox</span>
          <p className="text-sm font-semibold">
            {tab === "pending" ? "대기 중인 신청이 없습니다" : "승인된 후원이 없습니다"}
          </p>
        </div>
      ) : (
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
                  {tab === "approved" && (
                    <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant hidden md:table-cell">
                      승인일
                    </th>
                  )}
                  {tab === "pending" && (
                    <th className="text-center px-4 py-3 text-xs font-bold text-on-surface-variant">
                      액션
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {list.map((d) => (
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
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
                          익명
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-fixed text-primary-container">
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
                    {tab === "approved" && (
                      <td className="px-4 py-3 text-xs text-on-surface-variant hidden md:table-cell whitespace-nowrap">
                        {d.approved_at ? formatDate(d.approved_at) : "-"}
                      </td>
                    )}
                    {tab === "pending" && (
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleApprove(d.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-primary-fixed text-primary-container hover:bg-primary-container hover:text-white transition-all"
                          >
                            승인
                          </button>
                          <button
                            onClick={() => handleReject(d.id)}
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
      )}
    </div>
  );
}
