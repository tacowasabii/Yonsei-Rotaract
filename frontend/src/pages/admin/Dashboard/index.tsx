import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PersonIcon } from "@assets/icons";
import { useMembers } from "@/api/hooks/useMembers";
import { usePendingMembers, useApproveMember, useRejectMember } from "@/api/hooks/usePendingMembers";
import { PATHS } from "@/routes/paths";
import { isAdminOrAbove } from "../shared";
import StatCard from "./components/StatCard";

type ConfirmAction = { type: "approve" | "reject"; id: string; name: string } | null;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { role } = useAuth();
  const canApprove = isAdminOrAbove(role);
  const { data: members = [] } = useMembers();
  const { data: pendingMembers = [], isLoading: pendingLoading } = usePendingMembers();
  const approveMember = useApproveMember();
  const rejectMember = useRejectMember();

  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  function handleConfirm() {
    if (!confirmAction) return;
    if (confirmAction.type === "approve") {
      approveMember.mutate(confirmAction.id, { onSettled: () => setConfirmAction(null) });
    } else {
      rejectMember.mutate(confirmAction.id, { onSettled: () => setConfirmAction(null) });
    }
  }

  const stats = [
    { label: "전체 회원", value: members.length,                                           icon: "group",   color: "bg-primary-fixed text-primary-container" },
    { label: "가입 대기", value: pendingMembers.length,                                     icon: "pending", color: "bg-error/10 text-error" },
    { label: "현역 회원", value: members.filter((m) => m.member_type === "current").length, icon: "school",  color: "bg-secondary-fixed text-on-secondary-fixed" },
    { label: "졸업생",   value: members.filter((m) => m.member_type === "alumni").length,   icon: "work",    color: "bg-tertiary-fixed text-on-tertiary-fixed-variant" },
  ];

  const quickActions = [
    { icon: "announcement",  label: "공지 작성",  color: "bg-primary-fixed text-primary-container" },
    { icon: "photo_library", label: "사진첩 관리", color: "bg-secondary-fixed text-on-secondary-fixed" },
    { icon: "description",   label: "회칙 수정",  color: "bg-tertiary-fixed text-on-tertiary-fixed-variant" },
  ];

  return (
    <>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-black font-headline text-on-surface">대시보드</h1>
          <p className="text-sm text-on-surface-variant mt-1">연세 로타랙트 운영 현황</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        <div className="bg-surface-container-lowest rounded-2xl shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline font-bold text-on-surface">최근 가입 신청</h3>
            <button
              onClick={() => navigate(PATHS.ADMIN_PENDING)}
              className="text-sm text-primary-container font-semibold hover:underline flex items-center gap-1"
            >
              전체보기 <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
          <div className="space-y-3">
            {pendingLoading ? (
              <div className="flex items-center justify-center py-6 text-on-surface-variant">
                <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span>
                불러오는 중...
              </div>
            ) : pendingMembers.length === 0 ? (
              <p className="text-sm text-on-surface-variant text-center py-6">대기 중인 가입 신청이 없습니다.</p>
            ) : (
              pendingMembers.slice(0, 3).map((p) => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-outline-variant/10 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center">
                      <PersonIcon className="w-4 h-4 text-on-secondary-fixed-variant" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-on-surface">{p.name}</p>
                      <p className="text-xs text-on-surface-variant">
                        {p.department ?? "-"}{p.admission_year ? ` · ${String(p.admission_year).slice(-2)}학번` : ""}
                      </p>
                    </div>
                  </div>
                  {canApprove && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => setConfirmAction({ type: "approve", id: p.id, name: p.name })}
                        className="px-3 py-1 bg-primary-container text-white text-xs font-bold rounded-full hover:opacity-80"
                      >
                        승인
                      </button>
                      <button
                        onClick={() => setConfirmAction({ type: "reject", id: p.id, name: p.name })}
                        className="px-3 py-1 bg-error/10 text-error text-xs font-bold rounded-full hover:opacity-80"
                      >
                        거절
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <button key={action.label} className="bg-surface-container-lowest rounded-2xl p-5 shadow-card flex items-center gap-4 hover:bg-primary-fixed/20 transition-all text-left">
              <div className={`w-10 h-10 rounded-full ${action.color} flex items-center justify-center shrink-0`}>
                <span className="material-symbols-outlined text-xl">{action.icon}</span>
              </div>
              <span className="font-semibold text-sm text-on-surface">{action.label}</span>
            </button>
          ))}
        </div>
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
