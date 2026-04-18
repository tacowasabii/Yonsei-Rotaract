import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PersonOffIcon } from "@/assets/icons";
import { PATHS } from "@/routes/paths";

export default function InactivePage() {
  const { signOut, profile } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate(PATHS.LOGIN, { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="max-w-sm w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center mx-auto">
          <PersonOffIcon className="w-10 h-10 text-on-surface-variant" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black font-headline text-on-surface">계정이 비활성화되었습니다</h1>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            {profile?.name && (
              <><span className="font-semibold text-on-surface">{profile.name}</span>님의 </>
            )}
            계정이 비활성화 상태입니다.<br />
            자세한 사유는 운영진에게 문의해 주세요.
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-card text-left space-y-2">
          <div className="flex items-center gap-2 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-base text-on-surface-variant">contact_support</span>
            <span>운영진에게 연락하여 비활성화 사유를 확인하세요.</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-base text-on-surface-variant">lock_open</span>
            <span>운영진이 계정을 다시 활성화하면 이용 가능합니다.</span>
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
