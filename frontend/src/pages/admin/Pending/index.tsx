import { useRef, useState } from "react";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { useAuth } from "@/contexts/AuthContext";
import { usePendingMembers, useRejectedMembers, useApproveMember, useRejectMember } from "@/api/hooks/profiles/usePendingMembers";
import type { PendingMember, RejectedMember } from "@/api/types/member";
import { formatDate, formatPhone, isAdminOrAbove } from "../shared";
import MemberTypeBadge from "@components/common/MemberTypeBadge";
import Pagination from "@components/common/Pagination";

type Tab = "pending" | "rejected";
type ConfirmAction = { type: "approve" | "reject"; id: string; name: string } | null;

const PAGE_SIZE = 15;

function PendingTable({
  members,
  canApprove,
  onAction,
}: {
  members: (PendingMember | RejectedMember)[];
  canApprove: boolean;
  onAction?: (type: "approve" | "reject", id: string, name: string) => void;
}) {
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
                <td className="px-4 py-3 font-semibold text-on-surface">
                  {p.name}
                </td>
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

export default function AdminPending() {
  const { role } = useAuth();
  const { data: pendingMembers = [], isLoading: pendingLoading } = usePendingMembers();
  const { data: rejectedMembers = [] } = useRejectedMembers();
  const approveMember = useApproveMember();
  const rejectMember = useRejectMember();
  const canApprove = isAdminOrAbove(role);

  const [tab, setTab] = useState<Tab>("pending");
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const isMutating = approveMember.isPending || rejectMember.isPending;
  useOutsideClick(modalRef, () => { if (!isMutating) setConfirmAction(null); });

  function handleConfirm() {
    if (!confirmAction) return;
    if (confirmAction.type === "approve") {
      approveMember.mutate(confirmAction.id, { onSettled: () => setConfirmAction(null) });
    } else {
      rejectMember.mutate(confirmAction.id, { onSettled: () => setConfirmAction(null) });
    }
  }

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "pending", label: "대기 중", count: pendingMembers.length },
    { key: "rejected", label: "거절", count: rejectedMembers.length },
  ];

  return (
    <>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-black font-headline text-on-surface">가입 신청</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            가입 신청을 검토하고 승인 또는 거절하세요
          </p>
        </div>

        {/* 탭 */}
        <div className="flex gap-2">
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
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  tab === t.key
                    ? "bg-white/20 text-white"
                    : "bg-surface-container text-on-surface-variant"
                }`}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* 대기 중 탭 */}
        {tab === "pending" && (
          pendingLoading ? (
            <div className="flex items-center justify-center py-16 text-on-surface-variant">
              <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span>
              불러오는 중...
            </div>
          ) : pendingMembers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant gap-2">
              <span className="material-symbols-outlined text-4xl">inbox</span>
              <p className="text-sm font-semibold">대기 중인 가입 신청이 없습니다</p>
            </div>
          ) : (
            <PendingTable
              members={pendingMembers}
              canApprove={canApprove}
              onAction={(type, id, name) => setConfirmAction({ type, id, name })}
            />
          )
        )}

        {/* 거절 탭 */}
        {tab === "rejected" && (
          rejectedMembers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant gap-2">
              <span className="material-symbols-outlined text-4xl">inbox</span>
              <p className="text-sm font-semibold">거절된 신청이 없습니다</p>
            </div>
          ) : (
            <PendingTable
              members={rejectedMembers}
              canApprove={false}
            />
          )
        )}
      </div>

      {/* 확인 모달 */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div ref={modalRef} className="bg-surface-container-lowest rounded-3xl p-6 shadow-xl w-full max-w-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${confirmAction.type === "approve" ? "bg-primary-container/20" : "bg-error/10"}`}>
                <span className={`material-symbols-outlined text-xl ${confirmAction.type === "approve" ? "text-primary-container" : "text-error"}`}>
                  {confirmAction.type === "approve" ? "check_circle" : "cancel"}
                </span>
              </div>
              <h2 className="font-headline font-bold text-on-surface text-lg">
                {confirmAction.type === "approve" ? "가입 승인" : "가입 거절"}
              </h2>
            </div>
            <p className="text-sm text-on-surface-variant mb-6">
              <span className="font-bold text-on-surface">{confirmAction.name}</span>님의 가입 신청을{" "}
              {confirmAction.type === "approve" ? "승인" : "거절"}하시겠습니까?
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setConfirmAction(null)}
                disabled={approveMember.isPending || rejectMember.isPending}
                className="px-4 py-2 text-sm font-bold text-on-surface-variant rounded-full hover:bg-surface-container transition-colors disabled:opacity-50"
              >
                취소
              </button>
              <button
                onClick={handleConfirm}
                disabled={approveMember.isPending || rejectMember.isPending}
                className={`flex items-center gap-1.5 px-5 py-2 text-sm font-bold rounded-full transition-all disabled:opacity-50 ${
                  confirmAction.type === "approve"
                    ? "bg-primary-container text-white hover:opacity-80"
                    : "bg-error text-white hover:opacity-80"
                }`}
              >
                {(approveMember.isPending || rejectMember.isPending) && (
                  <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                )}
                {confirmAction.type === "approve" ? "승인" : "거절"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
