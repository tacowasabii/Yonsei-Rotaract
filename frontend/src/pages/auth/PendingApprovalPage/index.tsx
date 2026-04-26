import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { ScheduleIcon } from "@/assets/icons";
import { PATHS } from "@/routes/paths";

export default function PendingApprovalPage() {
  const { signOut, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (profile?.status === "active") {
      navigate(PATHS.HOME, { replace: true });
      return;
    }
  }, [profile?.status, navigate]);

  useEffect(() => {
    if (!profile?.id) return;
    const channel = supabase
      .channel("profile-status")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "profiles", filter: `id=eq.${profile.id}` },
        (payload) => {
          if ((payload.new as { status: string }).status === "active") {
            navigate(PATHS.HOME, { replace: true });
          }
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [profile?.id, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate(PATHS.LOGIN, { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="max-w-sm w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-secondary-fixed flex items-center justify-center mx-auto">
          <ScheduleIcon className="w-10 h-10 text-on-secondary-fixed-variant" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black font-headline text-on-surface">가입 승인 대기 중</h1>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            안녕하세요, <span className="font-semibold text-on-surface">{profile?.name}</span>님!<br />
            가입 신청이 완료되었습니다.<br />
            운영진 승인 후 서비스를 이용하실 수 있습니다.
          </p>
          <p className="text-xs text-on-surface-variant mt-3">
            승인까지 다소 시간이 소요될 수 있습니다.
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-card text-left space-y-2">
          <div className="flex items-center gap-2 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-base text-primary-container">info</span>
            <span>승인 완료 후 로그인하시면 자동으로 입장됩니다.</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-base text-primary-container">mail</span>
            <span>문의: 로타랙트 운영진에게 연락해 주세요.</span>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="w-full py-3 rounded-2xl bg-surface-container text-on-surface-variant text-sm font-semibold hover:bg-surface-container-high transition-colors"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}
