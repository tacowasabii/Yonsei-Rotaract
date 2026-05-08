import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { isAdminOrAbove } from "../shared";
import { DeleteIcon } from "@assets/icons";
import { useDonations } from "@/api/hooks/donations/useDonations";
import {
  useApproveDonation,
  useRejectDonation,
  useDeleteDonation,
  useToggleDonationVisibility,
} from "@/api/hooks/donations/useDonationMutations";
import type { DonationRecord } from "@/api/types/donation";
import ConfirmModal from "@components/admin/ConfirmModal";
import AdminTabBar from "@components/admin/AdminTabBar";
import DonationTable from "./components/DonationTable";

type DonationConfirmAction = {
  type: "approve" | "reject" | "delete-roster";
  id: string;
  name: string;
} | null;

type Tab = "pending" | "rejected" | "roster";

function getYear(dateStr: string) {
  return new Date(dateStr).getFullYear();
}

export default function AdminDonations() {
  const { role } = useAuth();
  const canManage = isAdminOrAbove(role);

  const [tab, setTab] = useState<Tab>("roster");
  const [confirmAction, setConfirmAction] = useState<DonationConfirmAction>(null);

  const [pendingPage, setPendingPage] = useState(1);
  const [rejectedPage, setRejectedPage] = useState(1);
  const [rosterPage, setRosterPage] = useState(1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const pendingQuery = useDonations("pending", pendingPage);
  const rejectedQuery = useDonations("rejected", rejectedPage);
  const rosterQuery = useDonations("approved", rosterPage);

  const approveMutation = useApproveDonation();
  const rejectMutation = useRejectDonation();
  const deleteMutation = useDeleteDonation();
  const toggleMutation = useToggleDonationVisibility();

  const rosterList = rosterQuery.data?.data ?? [];
  const rosterYears = Array.from(
    new Set(rosterList.filter((d) => d.approved_at).map((d) => getYear(d.approved_at!)))
  ).sort((a, b) => b - a);
  const filteredRoster = rosterList.filter(
    (d) => d.approved_at && getYear(d.approved_at) === selectedYear
  );

  function handleConfirm() {
    if (!confirmAction) return;
    if (confirmAction.type === "approve") approveMutation.mutate(confirmAction.id);
    else if (confirmAction.type === "reject") rejectMutation.mutate(confirmAction.id);
    else if (confirmAction.type === "delete-roster") deleteMutation.mutate(confirmAction.id);
    setConfirmAction(null);
  }

  const tabs: { key: Tab; label: string; count: number; showBadge: boolean }[] = [
    { key: "roster", label: "후원자 명단", count: rosterQuery.data?.total ?? 0, showBadge: false },
    { key: "pending", label: "대기 중", count: pendingQuery.data?.total ?? 0, showBadge: true },
    { key: "rejected", label: "거절", count: rejectedQuery.data?.total ?? 0, showBadge: true },
  ];

  const confirmMeta = confirmAction
    ? {
        approve: { title: "후원 승인", icon: "check_circle", isDestructive: false, label: "승인", suffix: "님의 후원 신청을 승인하시겠습니까?" },
        reject:  { title: "후원 거절", icon: "cancel",       isDestructive: true,  label: "거절", suffix: "님의 후원 신청을 거절하시겠습니까?" },
        "delete-roster": { title: "명단 삭제", icon: "delete", isDestructive: true, label: "삭제", suffix: "님을 후원자 명단에서 삭제하시겠습니까?" },
      }[confirmAction.type]
    : null;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-black font-headline text-on-surface">후원자 관리</h1>
        <p className="text-sm text-on-surface-variant mt-1">
          후원 신청을 검토하고 명예의 전당 명단을 관리하세요
        </p>
      </div>

      <AdminTabBar tabs={tabs} activeTab={tab} onChange={setTab} />

      {tab === "pending" && (
        <DonationTable
          list={pendingQuery.data?.data ?? []}
          total={pendingQuery.data?.total ?? 0}
          page={pendingPage}
          onPageChange={setPendingPage}
          loading={pendingQuery.isLoading}
          emptyMessage="대기 중인 신청이 없습니다"
          showActionsColumn={canManage}
          actions={(d) => (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setConfirmAction({ type: "approve", id: d.id, name: d.profiles?.name ?? "알 수 없음" })}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-primary-fixed text-primary-container hover:bg-primary-container hover:text-white transition-all"
              >
                승인
              </button>
              <button
                onClick={() => setConfirmAction({ type: "reject", id: d.id, name: d.profiles?.name ?? "알 수 없음" })}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-surface-container text-on-surface-variant hover:bg-error/10 hover:text-error transition-all"
              >
                거절
              </button>
            </div>
          )}
        />
      )}

      {tab === "rejected" && (
        <DonationTable
          list={rejectedQuery.data?.data ?? []}
          total={rejectedQuery.data?.total ?? 0}
          page={rejectedPage}
          onPageChange={setRejectedPage}
          loading={rejectedQuery.isLoading}
          emptyMessage="거절된 신청이 없습니다"
          showActionsColumn={false}
          actions={() => null}
        />
      )}

      {tab === "roster" && (
        <div className="space-y-4">
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
            total={filteredRoster.length}
            page={rosterPage}
            onPageChange={setRosterPage}
            loading={rosterQuery.isLoading}
            emptyMessage={`${selectedYear}년 후원자 명단이 없습니다`}
            showApprovedAt
            showVisibility
            onToggleHidden={(id, current) => toggleMutation.mutate({ id, isHidden: !current })}
            showActionsColumn={canManage}
            actions={(d: DonationRecord) => (
              <div className="flex items-center justify-center">
                <button
                  onClick={() => setConfirmAction({ type: "delete-roster", id: d.id, name: d.profiles?.name ?? "알 수 없음" })}
                  className="p-1.5 rounded-lg text-on-surface-variant hover:bg-error/10 hover:text-error transition-all"
                  title="삭제"
                >
                  <DeleteIcon className="w-4 h-4" />
                </button>
              </div>
            )}
          />
        </div>
      )}

      {confirmAction && confirmMeta && (
        <ConfirmModal
          title={confirmMeta.title}
          icon={confirmMeta.icon}
          isDestructive={confirmMeta.isDestructive}
          confirmLabel={confirmMeta.label}
          message={
            <>
              <span className="font-bold text-on-surface">{confirmAction.name}</span>
              {confirmMeta.suffix}
            </>
          }
          onConfirm={handleConfirm}
          onClose={() => setConfirmAction(null)}
        />
      )}
    </div>
  );
}
