import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMembers } from "@/api/hooks/useMembers";
import { usePendingMembers, useApproveMember, useRejectMember } from "@/api/hooks/usePendingMembers";
import { PATHS } from "@/routes/paths";
import { MOCK_MEMBERS, isAdminOrAbove } from "./shared";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { role } = useAuth();
  const canApprove = isAdminOrAbove(role);
  const { data: fetchedMembers } = useMembers();
  const { data: pendingMembers = [], isLoading: pendingLoading } = usePendingMembers();
  const approveMember = useApproveMember();
  const rejectMember = useRejectMember();

  const isMockData = !fetchedMembers || fetchedMembers.length === 0;
  const members = isMockData ? MOCK_MEMBERS : fetchedMembers;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black font-headline text-on-surface">대시보드</h1>
        <p className="text-sm text-on-surface-variant mt-1">연세 로타랙트 운영 현황</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "전체 회원", value: members.length,                                           icon: "group",   color: "bg-primary-fixed text-primary-container" },
          { label: "가입 대기", value: pendingMembers.length,                                     icon: "pending", color: "bg-error/10 text-error" },
          { label: "현역 회원", value: members.filter((m) => m.member_type === "current").length, icon: "school",  color: "bg-secondary-fixed text-on-secondary-fixed" },
          { label: "졸업생",   value: members.filter((m) => m.member_type === "alumni").length,   icon: "work",    color: "bg-tertiary-fixed text-on-tertiary-fixed-variant" },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-container-lowest rounded-2xl p-5 shadow-card">
            <div className={`w-10 h-10 rounded-full ${stat.color} flex items-center justify-center mb-3`}>
              <span className="material-symbols-outlined text-xl">{stat.icon}</span>
            </div>
            <p className="text-2xl font-extrabold font-headline text-on-surface">{stat.value}</p>
            <p className="text-xs text-on-surface-variant mt-0.5">{stat.label}</p>
          </div>
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
                    <span className="material-symbols-outlined text-base text-on-secondary-fixed-variant">person</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-on-surface">{p.name}</p>
                    <p className="text-xs text-on-surface-variant">
                      {p.department ?? "-"}{p.admission_year ? ` · ${p.admission_year}년 입학` : ""}
                    </p>
                  </div>
                </div>
                {canApprove && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => approveMember.mutate(p.id)}
                      className="px-3 py-1 bg-primary-container text-white text-xs font-bold rounded-full hover:opacity-80"
                    >
                      승인
                    </button>
                    <button
                      onClick={() => rejectMember.mutate(p.id)}
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
        {[
          { icon: "announcement",  label: "공지 작성",  color: "bg-primary-fixed text-primary-container" },
          { icon: "photo_library", label: "사진첩 관리", color: "bg-secondary-fixed text-on-secondary-fixed" },
          { icon: "description",   label: "회칙 수정",  color: "bg-tertiary-fixed text-on-tertiary-fixed-variant" },
        ].map((action) => (
          <button key={action.label} className="bg-surface-container-lowest rounded-2xl p-5 shadow-card flex items-center gap-4 hover:bg-primary-fixed/20 transition-all text-left">
            <div className={`w-10 h-10 rounded-full ${action.color} flex items-center justify-center shrink-0`}>
              <span className="material-symbols-outlined text-xl">{action.icon}</span>
            </div>
            <span className="font-semibold text-sm text-on-surface">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
