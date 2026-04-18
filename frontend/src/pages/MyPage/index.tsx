import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useMyProfile, useUpdateMyPhone, useUpdatePassword } from "@/api/hooks/useMyProfile";

const ROLE_LABELS: Record<string, string> = {
  user: "일반 회원",
  staff: "운영진",
  admin: "관리자",
  super_admin: "최고 관리자",
};

const ROLE_COLORS: Record<string, string> = {
  user: "bg-surface-container text-on-surface-variant",
  staff: "bg-secondary-fixed text-on-secondary-fixed",
  admin: "bg-primary-fixed text-primary-container",
  super_admin: "bg-error/10 text-error",
};

function formatPhone(phone: string | null | undefined): string {
  if (!phone) return "-";
  const d = phone.replace(/\D/g, "");
  if (d.length === 11) return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
  return phone;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, "0")}. ${String(d.getDate()).padStart(2, "0")}`;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-4">
      <span className="text-xs font-semibold text-on-surface-variant w-14 shrink-0">{label}</span>
      <span className="text-sm text-on-surface">{value}</span>
    </div>
  );
}

export default function MyPage() {
  const { user } = useAuth();
  const { data: profile, isLoading, isError } = useMyProfile(user?.id);

  const [phoneEdit, setPhoneEdit] = useState(false);
  const [phoneValue, setPhoneValue] = useState("");

  const [pwOpen, setPwOpen] = useState(false);
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);

  const updatePhone = useUpdateMyPhone();
  const updatePw = useUpdatePassword();

  const handlePhoneEdit = () => {
    setPhoneValue(profile?.phone ?? "");
    setPhoneEdit(true);
  };

  const handlePhoneSave = () => {
    if (!user?.id) return;
    updatePhone.mutate({ userId: user.id, phone: phoneValue }, {
      onSuccess: () => setPhoneEdit(false),
    });
  };

  const handlePwSave = () => {
    setPwError("");
    if (newPw.length < 6) { setPwError("비밀번호는 6자 이상이어야 합니다."); return; }
    if (newPw !== confirmPw) { setPwError("비밀번호가 일치하지 않습니다."); return; }
    updatePw.mutate(newPw, {
      onSuccess: () => {
        setPwSuccess(true);
        setNewPw("");
        setConfirmPw("");
        setTimeout(() => { setPwOpen(false); setPwSuccess(false); }, 1500);
      },
      onError: () => setPwError("비밀번호 변경에 실패했습니다. 다시 시도해주세요."),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-on-surface-variant">
        <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span>
        불러오는 중...
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center text-on-surface-variant">
        프로필을 불러오지 못했습니다.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      {/* 프로필 헤더 */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-card p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center shrink-0">
          <span className="text-2xl font-black text-white">{profile.name.charAt(0)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-black font-headline text-on-surface">{profile.name}</h1>
          <div className="flex flex-wrap gap-2 mt-1.5">
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${ROLE_COLORS[profile.role] ?? "bg-surface-container text-on-surface-variant"}`}>
              {ROLE_LABELS[profile.role] ?? profile.role}
            </span>
            {profile.member_type && (
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${profile.member_type === "current" ? "bg-secondary-fixed text-on-secondary-fixed" : "bg-tertiary-fixed text-on-tertiary-fixed-variant"}`}>
                {profile.member_type === "current" ? "현역" : "졸업생"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 기본 정보 + 연락처 */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-card divide-y divide-outline-variant/10">
        <div className="px-6 py-5">
          <h2 className="text-xs font-bold text-on-surface-variant mb-3">기본 정보</h2>
          <div className="space-y-3">
            <InfoRow label="이메일" value={profile.email || "-"} />
            <InfoRow label="학과" value={profile.department ?? "-"} />
            <InfoRow label="학번" value={profile.admission_year ? `${String(profile.admission_year).slice(-2)}학번` : "-"} />
            <InfoRow label="기수" value={profile.generation ?? "-"} />
            <InfoRow label="가입일" value={formatDate(profile.created_at)} />
          </div>
        </div>

        <div className="px-6 py-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-on-surface-variant">연락처</span>
            {!phoneEdit && (
              <button onClick={handlePhoneEdit} className="text-xs font-bold text-primary-container hover:underline">
                수정
              </button>
            )}
          </div>
          {phoneEdit ? (
            <div className="flex gap-2">
              <input
                type="tel"
                value={phoneValue}
                onChange={(e) => setPhoneValue(e.target.value)}
                placeholder="010-0000-0000"
                className="flex-1 px-3 py-2 text-sm bg-surface-container rounded-xl outline-none focus:ring-2 focus:ring-primary-container/30 text-on-surface"
              />
              <button
                onClick={handlePhoneSave}
                disabled={updatePhone.isPending}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-primary-container text-white hover:opacity-90 disabled:opacity-50 transition-all"
              >
                저장
              </button>
              <button
                onClick={() => setPhoneEdit(false)}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all"
              >
                취소
              </button>
            </div>
          ) : (
            <p className="text-sm text-on-surface">{formatPhone(profile.phone)}</p>
          )}
        </div>
      </div>

      {/* 비밀번호 변경 */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-on-surface">비밀번호 변경</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">새 비밀번호를 설정합니다</p>
          </div>
          {!pwOpen && (
            <button
              onClick={() => setPwOpen(true)}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all"
            >
              변경
            </button>
          )}
        </div>

        {pwOpen && (
          <div className="mt-4 space-y-3">
            <div>
              <label className="text-xs font-semibold text-on-surface-variant block mb-1">새 비밀번호</label>
              <input
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="6자 이상 입력"
                className="w-full px-3 py-2.5 text-sm bg-surface-container rounded-xl outline-none focus:ring-2 focus:ring-primary-container/30 text-on-surface"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-on-surface-variant block mb-1">새 비밀번호 확인</label>
              <input
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="비밀번호를 다시 입력"
                className="w-full px-3 py-2.5 text-sm bg-surface-container rounded-xl outline-none focus:ring-2 focus:ring-primary-container/30 text-on-surface"
              />
            </div>
            {pwError && (
              <p className="text-xs text-error flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">error</span>
                {pwError}
              </p>
            )}
            {pwSuccess && (
              <p className="text-xs text-primary-container flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                비밀번호가 변경되었습니다.
              </p>
            )}
            <div className="flex gap-2 pt-1">
              <button
                onClick={handlePwSave}
                disabled={updatePw.isPending}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-primary-container text-white hover:opacity-90 disabled:opacity-50 transition-all"
              >
                {updatePw.isPending ? "변경 중..." : "저장"}
              </button>
              <button
                onClick={() => { setPwOpen(false); setNewPw(""); setConfirmPw(""); setPwError(""); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all"
              >
                취소
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
