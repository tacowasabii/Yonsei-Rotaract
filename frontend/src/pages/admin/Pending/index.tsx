import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePendingMembers, useRejectedMembers, useApproveMember, useRejectMember } from "@/api/hooks/usePendingMembers";
import { formatDate, isAdminOrAbove } from "../shared";
import MailIcon from "@/assets/icons/mail.svg?react";
import CallIcon from "@/assets/icons/call.svg?react";

type ConfirmAction = { type: "approve" | "reject"; id: string; name: string } | null;

export default function AdminPending() {
  const { role } = useAuth();
  const { data: pendingMembers = [], isLoading: pendingLoading } = usePendingMembers();
  const { data: rejectedMembers = [] } = useRejectedMembers();
  const approveMember = useApproveMember();
  const rejectMember = useRejectMember();
  const pendingCount = pendingMembers.length;
  const canApprove = isAdminOrAbove(role);

  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  function handleConfirm() {
    if (!confirmAction) return;
    if (confirmAction.type === "approve") {
      approveMember.mutate(confirmAction.id, { onSettled: () => setConfirmAction(null) });
    } else {
      rejectMember.mutate(confirmAction.id, { onSettled: () => setConfirmAction(null) });
    }
  }

  return (
    <>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-black font-headline text-on-surface">가입 신청</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            <span className="font-bold text-error">{pendingCount}건</span> 대기 중
          </p>
        </div>

        {pendingLoading ? (
          <div className="flex items-center justify-center py-16 text-on-surface-variant">
            <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span>
            불러오는 중...
          </div>
        ) : pendingMembers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant gap-3">
            <span className="material-symbols-outlined text-4xl">check_circle</span>
            <p className="text-sm">대기 중인 가입 신청이 없습니다.</p>
          </div>
        ) : (
          pendingMembers.map((p) => (
            <div key={p.id} className="bg-surface-container-lowest rounded-2xl p-5 shadow-card">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-2xl text-on-secondary-fixed-variant">person</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-on-surface">{p.name}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.member_type === "current" ? "bg-secondary-fixed text-on-secondary-fixed" : "bg-tertiary-fixed text-on-tertiary-fixed-variant"}`}>
                        {p.member_type === "current" ? "현역" : "졸업생"}
                      </span>
                    </div>
                    <p className="text-sm text-on-surface-variant mt-0.5">
                      {p.department ?? "-"}{p.admission_year ? ` · ${String(p.admission_year).slice(-2)}학번` : ""}
                      {p.generation ? ` · ${p.generation}` : ""}
                    </p>
                    <p className="text-xs text-on-surface-variant mt-0.5 flex items-center gap-3 flex-wrap">
                      <span className="flex items-center gap-1"><MailIcon className="w-4 h-4 shrink-0" />{p.email}</span>
                      {p.phone && <span className="flex items-center gap-1"><CallIcon className="w-4 h-4 shrink-0" />{p.phone}</span>}
                    </p>
                    <p className="text-xs text-on-surface-variant mt-0.5">신청일시: {formatDate(p.created_at)}</p>
                  </div>
                </div>
                {canApprove && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setConfirmAction({ type: "approve", id: p.id, name: p.name })}
                      className="flex items-center gap-1.5 px-4 py-2 bg-primary-container text-white text-sm font-bold rounded-full hover:opacity-80 active:scale-95 transition-all"
                    >
                      <span className="material-symbols-outlined text-base">check_circle</span>승인
                    </button>
                    <button
                      onClick={() => setConfirmAction({ type: "reject", id: p.id, name: p.name })}
                      className="flex items-center gap-1.5 px-4 py-2 bg-error/10 text-error text-sm font-bold rounded-full hover:opacity-80 active:scale-95 transition-all"
                    >
                      <span className="material-symbols-outlined text-base">cancel</span>거절
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {/* 가입 거절 목록 */}
        {rejectedMembers.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="font-headline font-bold text-on-surface-variant">가입 거절 목록</h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
                {rejectedMembers.length}건
              </span>
            </div>
            <div className="space-y-3">
              {rejectedMembers.map((p) => (
                <div key={p.id} className="bg-surface-container-lowest rounded-2xl p-5 shadow-card opacity-60">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-xl text-on-surface-variant">person_off</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-on-surface">{p.name}</p>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
                          거절됨
                        </span>
                        {p.member_type && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.member_type === "current" ? "bg-secondary-fixed text-on-secondary-fixed" : "bg-tertiary-fixed text-on-tertiary-fixed-variant"}`}>
                            {p.member_type === "current" ? "현역" : "졸업생"}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-on-surface-variant mt-0.5">
                        {p.department ?? "-"}{p.admission_year ? ` · ${String(p.admission_year).slice(-2)}학번` : ""}
                        {p.generation ? ` · ${p.generation}` : ""}
                      </p>
                      <p className="text-xs text-on-surface-variant mt-0.5 flex items-center gap-3 flex-wrap">
                        <span className="flex items-center gap-1"><MailIcon className="w-4 h-4 shrink-0" />{p.email}</span>
                        {p.phone && <span className="flex items-center gap-1"><CallIcon className="w-4 h-4 shrink-0" />{p.phone}</span>}
                      </p>
                      <p className="text-xs text-on-surface-variant mt-0.5">신청일시: {formatDate(p.created_at)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 확인 모달 */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-xl w-full max-w-sm">
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
