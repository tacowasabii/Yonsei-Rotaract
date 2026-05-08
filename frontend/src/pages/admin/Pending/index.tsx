import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePendingMembers, useRejectedMembers, useApproveMember, useRejectMember } from "@/api/hooks/profiles/usePendingMembers";
import { isAdminOrAbove } from "../shared";
import ConfirmModal from "@components/admin/ConfirmModal";
import AdminTabBar from "@components/admin/AdminTabBar";
import LoadingState from "@components/admin/LoadingState";
import EmptyState from "@components/admin/EmptyState";
import PendingTable from "./components/PendingTable";

type Tab = "pending" | "rejected";
type ConfirmAction = { type: "approve" | "reject"; id: string; name: string } | null;

export default function AdminPending() {
  const { role } = useAuth();
  const { data: pendingMembers = [], isLoading: pendingLoading } = usePendingMembers();
  const { data: rejectedMembers = [] } = useRejectedMembers();
  const approveMember = useApproveMember();
  const rejectMember = useRejectMember();
  const canApprove = isAdminOrAbove(role);

  const [tab, setTab] = useState<Tab>("pending");
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const isMutating = approveMember.isPending || rejectMember.isPending;

  function handleConfirm() {
    if (!confirmAction) return;
    if (confirmAction.type === "approve") {
      approveMember.mutate(confirmAction.id, { onSettled: () => setConfirmAction(null) });
    } else {
      rejectMember.mutate(confirmAction.id, { onSettled: () => setConfirmAction(null) });
    }
  }

  const tabs = [
    { key: "pending" as Tab, label: "대기 중", count: pendingMembers.length, showBadge: true },
    { key: "rejected" as Tab, label: "거절", count: rejectedMembers.length, showBadge: true },
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

        <AdminTabBar tabs={tabs} activeTab={tab} onChange={setTab} />

        {tab === "pending" && (
          pendingLoading ? (
            <LoadingState />
          ) : pendingMembers.length === 0 ? (
            <EmptyState message="대기 중인 가입 신청이 없습니다" />
          ) : (
            <PendingTable
              members={pendingMembers}
              canApprove={canApprove}
              onAction={(type, id, name) => setConfirmAction({ type, id, name })}
            />
          )
        )}

        {tab === "rejected" && (
          rejectedMembers.length === 0 ? (
            <EmptyState message="거절된 신청이 없습니다" />
          ) : (
            <PendingTable members={rejectedMembers} canApprove={false} />
          )
        )}
      </div>

      {confirmAction && (
        <ConfirmModal
          title={confirmAction.type === "approve" ? "가입 승인" : "가입 거절"}
          icon={confirmAction.type === "approve" ? "check_circle" : "cancel"}
          isDestructive={confirmAction.type === "reject"}
          confirmLabel={confirmAction.type === "approve" ? "승인" : "거절"}
          message={
            <>
              <span className="font-bold text-on-surface">{confirmAction.name}</span>님의 가입 신청을{" "}
              {confirmAction.type === "approve" ? "승인" : "거절"}하시겠습니까?
            </>
          }
          onConfirm={handleConfirm}
          onClose={() => { if (!isMutating) setConfirmAction(null); }}
          isPending={isMutating}
        />
      )}
    </>
  );
}
