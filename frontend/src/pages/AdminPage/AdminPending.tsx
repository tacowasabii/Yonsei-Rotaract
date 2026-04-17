import { usePendingMembers, useApproveMember, useRejectMember } from "@/api/hooks/usePendingMembers";
import { formatDate } from "./shared";

export default function AdminPending() {
  const { data: pendingMembers = [], isLoading: pendingLoading } = usePendingMembers();
  const approveMember = useApproveMember();
  const rejectMember = useRejectMember();
  const pendingCount = pendingMembers.length;

  return (
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
            <div className="flex items-start justify-between gap-4 flex-wrap">
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
                    {p.department ?? "-"}{p.admission_year ? ` · ${p.admission_year}년 입학` : ""}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-0.5">{p.email}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">신청일시: {formatDate(p.created_at)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => approveMember.mutate(p.id)}
                  disabled={approveMember.isPending}
                  className="flex items-center gap-1.5 px-4 py-2 bg-primary-container text-white text-sm font-bold rounded-full hover:opacity-80 active:scale-95 transition-all disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-base">check_circle</span>승인
                </button>
                <button
                  onClick={() => rejectMember.mutate(p.id)}
                  disabled={rejectMember.isPending}
                  className="flex items-center gap-1.5 px-4 py-2 bg-error/10 text-error text-sm font-bold rounded-full hover:opacity-80 active:scale-95 transition-all disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-base">cancel</span>거절
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
