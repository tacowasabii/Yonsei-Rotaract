import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { CancelIcon } from "@/assets/icons";
import { PATHS } from "@/routes/paths";

export default function RejectedPage() {
  const { signOut, profile } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate(PATHS.LOGIN, { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="max-w-sm w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center mx-auto">
          <CancelIcon className="w-10 h-10 text-error" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black font-headline text-on-surface">가입이 거절되었습니다</h1>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            {profile?.name && (
              <><span className="font-semibold text-on-surface">{profile.name}</span>님의 </>
            )}
            가입 신청이 거절되었습니다.<br />
            자세한 사유는 운영진에게 문의해 주세요.
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-card text-left space-y-2">
          <div className="flex items-center gap-2 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-base text-error">contact_support</span>
            <span>운영진에게 연락하여 거절 사유를 확인하세요.</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-base text-error">restart_alt</span>
            <span>재가입을 원하시면 운영진 승인 후 다시 신청 가능합니다.</span>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="w-full py-3 rounded-2xl bg-error/10 text-error text-sm font-semibold hover:bg-error/20 transition-colors"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}
