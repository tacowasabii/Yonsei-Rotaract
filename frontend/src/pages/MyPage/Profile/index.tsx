import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  useMyProfile,
  useUpdateMyPhone,
  useUpdateMyMemberType,
  useUpdatePassword,
} from "@/api/hooks/useMyProfile";
import { formatPhone, formatDate } from "../shared";
import InfoRow from "../components/InfoRow";

export default function MyProfile() {
  const { user } = useAuth();
  const { data: profile } = useMyProfile(user?.id);

  const [phoneEdit, setPhoneEdit] = useState(false);
  const [phoneValue, setPhoneValue] = useState("");

  const [memberType, setMemberType] = useState<"current" | "alumni">("current");
  useEffect(() => {
    if (profile?.member_type) setMemberType(profile.member_type as "current" | "alumni");
  }, [profile?.member_type]);

  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyPublic, setCompanyPublic] = useState(true);
  const [companySaving, setCompanySaving] = useState(false);

  const [pwOpen, setPwOpen] = useState(false);
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);

  const updatePhone = useUpdateMyPhone();
  const updateType = useUpdateMyMemberType();
  const updatePw = useUpdatePassword();

  if (!profile) return null;

  const handlePhoneSave = () => {
    if (!user?.id) return;
    updatePhone.mutate({ userId: user.id, phone: phoneValue }, {
      onSuccess: () => setPhoneEdit(false),
    });
  };

  const handleTypeToggle = (next: "current" | "alumni") => {
    if (!user?.id || next === memberType) return;
    const prev = memberType;
    setMemberType(next);
    updateType.mutate({ userId: user.id, memberType: next }, {
      onError: () => setMemberType(prev),
    });
  };

  const handleCompanySave = () => {
    setCompanySaving(true);
    // TODO: DB 컬럼(company, job_title, is_company_public) 추가 후 연동
    setTimeout(() => setCompanySaving(false), 600);
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

  return (
    <div className="space-y-4">
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
              <button
                onClick={() => { setPhoneValue(profile.phone ?? ""); setPhoneEdit(true); }}
                className="text-xs font-bold text-primary-container hover:underline"
              >
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

      {/* 회원 구분 변경 */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-card px-6 py-5">
        <h2 className="text-xs font-bold text-on-surface-variant mb-3">회원 구분</h2>
        <div className="bg-surface-container rounded-2xl p-1 flex gap-1 w-fit">
          {(["current", "alumni"] as const).map((type) => (
            <button
              key={type}
              onClick={() => handleTypeToggle(type)}
              disabled={updateType.isPending}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-60 ${
                memberType === type
                  ? "bg-primary-container text-white shadow-card"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {type === "current" ? "현역" : "졸업생"}
            </button>
          ))}
        </div>
      </div>

      {/* 졸업생 회사 정보 */}
      {memberType === "alumni" && (
        <div className="bg-surface-container-lowest rounded-2xl shadow-card px-6 py-5 space-y-4">
          <h2 className="text-xs font-bold text-on-surface-variant">회사 정보</h2>
          <div className="space-y-3">
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
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${companyPublic ? "bg-primary-container" : "bg-surface-container-high"}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${companyPublic ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </div>
          </div>
          <button
            onClick={handleCompanySave}
            disabled={companySaving}
            className="w-full py-2.5 rounded-xl text-sm font-bold bg-primary-container text-white hover:opacity-90 disabled:opacity-70 transition-all"
          >
            {companySaving ? "저장 중..." : "저장"}
          </button>
        </div>
      )}

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
