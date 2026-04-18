import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useMyProfile, useUpdateMyMemberType } from "@/api/hooks/useMyProfile";
import {
  updateMyPhone,
  updatePassword,
  verifyCurrentPassword,
} from "@/api/profiles";
import { formatDate } from "../shared";
import InfoRow from "../components/InfoRow";

export default function MyProfile() {
  const { user } = useAuth();
  const { data: profile } = useMyProfile(user?.id);
  const queryClient = useQueryClient();
  const updateType = useUpdateMyMemberType();

  const [phoneValue, setPhoneValue] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyPublic, setCompanyPublic] = useState(true);
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [currentPw, setCurrentPw] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setPhoneValue(profile.phone ?? "");
  }, [profile]);

  if (!profile) return null;

  const isAlumni = profile.member_type === "alumni";

  const handleTypeChange = () => {
    if (!user?.id) return;
    updateType.mutate({ userId: user.id, memberType: "alumni" }, {
      onSuccess: () => setShowTypeModal(false),
    });
  };

  const handleSave = async () => {
    setError("");
    if (!currentPw) { setError("현재 비밀번호를 입력해주세요."); return; }
    if (newPw && newPw.length < 6) { setError("새 비밀번호는 6자 이상이어야 합니다."); return; }
    if (newPw && newPw !== confirmPw) { setError("새 비밀번호가 일치하지 않습니다."); return; }

    setSaving(true);
    try {
      const isValid = await verifyCurrentPassword(user!.email!, currentPw);
      if (!isValid) { setError("현재 비밀번호가 올바르지 않습니다."); setSaving(false); return; }

      const tasks: Promise<void>[] = [];
      if (phoneValue !== (profile.phone ?? "")) tasks.push(updateMyPhone(user!.id, phoneValue));
      if (newPw) tasks.push(updatePassword(newPw));

      await Promise.all(tasks);
      queryClient.invalidateQueries({ queryKey: ["my-profile", user!.id] });
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch {
      setError("저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* 기본 정보 (읽기 전용) */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-card px-6 py-5">
        <h2 className="text-xs font-bold text-on-surface-variant mb-3">기본 정보</h2>
        <div className="space-y-3">
          <InfoRow label="이메일" value={profile.email || "-"} />
          <InfoRow label="학과" value={profile.department ?? "-"} />
          <InfoRow label="학번" value={profile.admission_year ? `${String(profile.admission_year).slice(-2)}학번` : "-"} />
          <InfoRow label="기수" value={profile.generation ?? "-"} />
          <InfoRow label="가입일" value={formatDate(profile.created_at)} />
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-on-surface-variant w-14 shrink-0">회원 구분</span>
            <div className="flex items-center gap-3">
              <span className="text-sm text-on-surface">{isAlumni ? "졸업생" : "현역"}</span>
              {!isAlumni && (
                <button
                  onClick={() => setShowTypeModal(true)}
                  className="text-xs font-semibold text-on-surface-variant/50 hover:text-error underline underline-offset-2 transition-colors"
                >
                  졸업생으로 변경
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 정보 수정 */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-card divide-y divide-outline-variant/10">
        {/* 연락처 */}
        <div className="px-6 py-5">
          <label className="text-xs font-bold text-on-surface-variant block mb-2">연락처</label>
          <input
            type="tel"
            value={phoneValue}
            onChange={(e) => setPhoneValue(e.target.value)}
            placeholder="010-0000-0000"
            className="w-full px-3 py-2.5 text-sm bg-surface-container rounded-xl outline-none focus:ring-2 focus:ring-primary-container/30 text-on-surface"
          />
        </div>

        {/* 회사 정보 (졸업생만) */}
        {isAlumni && (
          <div className="px-6 py-5 space-y-3">
            <label className="text-xs font-bold text-on-surface-variant block">회사 정보</label>
            <div>
              <label className="text-xs font-semibold text-on-surface-variant block mb-1">회사명</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="회사명을 입력하세요"
                className="w-full px-3 py-2.5 text-sm bg-surface-container rounded-xl outline-none focus:ring-2 focus:ring-primary-container/30 text-on-surface"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-on-surface-variant block mb-1">직책</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="직책을 입력하세요"
                className="w-full px-3 py-2.5 text-sm bg-surface-container rounded-xl outline-none focus:ring-2 focus:ring-primary-container/30 text-on-surface"
              />
            </div>
            <div className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm font-semibold text-on-surface">공개 여부</p>
                <p className="text-xs text-on-surface-variant mt-0.5">선배님 페이지에 회사 정보를 공개합니다</p>
              </div>
              <button
                role="switch"
                aria-checked={companyPublic}
                onClick={() => setCompanyPublic((v) => !v)}
                className={`w-12 h-7 rounded-full transition-colors relative shrink-0 ${companyPublic ? "bg-primary-container" : "bg-surface-container-highest"}`}
              >
                <span className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${companyPublic ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>
          </div>
        )}

        {/* 비밀번호 변경 (선택) */}
        <div className="px-6 py-5 space-y-3">
          <label className="text-xs font-bold text-on-surface-variant block">
            비밀번호 변경 <span className="font-normal text-on-surface-variant/60">(선택)</span>
          </label>
          <div>
            <label className="text-xs font-semibold text-on-surface-variant block mb-1">새 비밀번호</label>
            <input
              type="password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder="변경 시에만 입력 (6자 이상)"
              className="w-full px-3 py-2.5 text-sm bg-surface-container rounded-xl outline-none focus:ring-2 focus:ring-primary-container/30 text-on-surface"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-on-surface-variant block mb-1">새 비밀번호 확인</label>
            <input
              type="password"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              placeholder="새 비밀번호를 다시 입력"
              className="w-full px-3 py-2.5 text-sm bg-surface-container rounded-xl outline-none focus:ring-2 focus:ring-primary-container/30 text-on-surface"
            />
          </div>
        </div>

        {/* 현재 비밀번호 + 저장 */}
        <div className="px-6 py-5 space-y-3">
          <div>
            <label className="text-xs font-bold text-on-surface-variant block mb-2">현재 비밀번호 확인</label>
            <input
              type="password"
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              placeholder="저장하려면 현재 비밀번호를 입력하세요"
              className="w-full px-3 py-2.5 text-sm bg-surface-container rounded-xl outline-none focus:ring-2 focus:ring-primary-container/30 text-on-surface"
            />
          </div>
          {error && (
            <p className="text-xs text-error flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">error</span>
              {error}
            </p>
          )}
          {success && (
            <p className="text-xs text-primary-container flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              저장되었습니다.
            </p>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-2.5 rounded-xl text-sm font-bold bg-primary-container text-white hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {saving ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>

      {/* 졸업생 변경 확인 모달 */}
      {showTypeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setShowTypeModal(false)}
        >
          <div
            className="bg-surface-container-lowest rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-on-tertiary-container text-2xl mt-0.5">warning</span>
              <div>
                <h3 className="text-base font-bold text-on-surface">졸업생으로 변경</h3>
                <p className="text-sm text-on-surface-variant mt-1.5 leading-relaxed">
                  한번 졸업생으로 변경하면{" "}
                  <span className="font-bold text-on-tertiary-container">다시 현역으로 되돌릴 수 없습니다.</span>{" "}
                  계속하시겠습니까?
                </p>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setShowTypeModal(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all"
              >
                취소
              </button>
              <button
                onClick={handleTypeChange}
                disabled={updateType.isPending}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-on-tertiary-container text-white hover:opacity-90 disabled:opacity-50 transition-all"
              >
                {updateType.isPending ? "변경 중..." : "졸업생으로 변경"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
