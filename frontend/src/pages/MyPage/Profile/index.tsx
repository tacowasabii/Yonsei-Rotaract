import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useMyProfile, useUpdateMyMemberType, useUpdateMarketingAgree } from "@/api/hooks/profiles/useMyProfile";
import { AgreementModal } from "@components/common/AgreementModal";
import {
  updateMyPhone,
  updatePassword,
  verifyCurrentPassword,
  updateMyCompanyInfo,
} from "@/api/profiles";
import InfoRow from "../components/InfoRow";
import { HelpIcon } from "@assets/icons";
import FieldError from "./components/FieldError";
import AlumniTypeModal from "./components/AlumniTypeModal";

type FormValues = {
  phone: string;
  company: string;
  jobTitle: string;
  companyPublic: boolean;
  newPw: string;
  confirmPw: string;
  currentPw: string;
};

const PW_PATTERN = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])/;

const inputCls = (hasError: boolean) =>
  `w-full px-3 py-2.5 text-sm bg-surface-container rounded-xl outline-none focus:ring-2 focus:ring-primary-container/30 text-on-surface${hasError ? " ring-2 ring-error/30" : ""}`;

export default function MyProfile() {
  const { user } = useAuth();
  const { data: profile } = useMyProfile(user?.id);
  const queryClient = useQueryClient();
  const updateType = useUpdateMyMemberType();

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    setError,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ mode: "onBlur" });

  const companyPublic = watch("companyPublic");

  const updateMarketing = useUpdateMarketingAgree();
  const [marketingAgree, setMarketingAgree] = useState(false);
  const [marketingSaved, setMarketingSaved] = useState(false);
  const [showMarketingModal, setShowMarketingModal] = useState(false);

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showInfoPopover, setShowInfoPopover] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!profile) return;
    if (profile.phone) setValue("phone", profile.phone);
    setValue("company", profile.company ?? "");
    setValue("jobTitle", profile.job_title ?? "");
    setValue("companyPublic", profile.is_company_public ?? true);
    setMarketingAgree(profile.marketing_agree ?? false);
  }, [profile, setValue]);

  function handleMarketingToggle() {
    if (!user?.id) return;
    const next = !marketingAgree;
    setMarketingAgree(next);
    updateMarketing.mutate(
      { userId: user.id, value: next },
      {
        onSuccess: () => {
          setMarketingSaved(true);
          setTimeout(() => setMarketingSaved(false), 1500);
        },
        onError: () => setMarketingAgree(!next),
      }
    );
  }

  if (!profile) return null;

  const isAlumni = profile.member_type === "alumni";

  function handleTypeChange() {
    if (!user?.id) return;
    updateType.mutate(
      { userId: user.id, memberType: "alumni" },
      { onSuccess: () => setShowTypeModal(false) },
    );
  }

  const onSubmit = async (data: FormValues) => {
    setSaving(true);
    try {
      const isValid = await verifyCurrentPassword(user!.email!, data.currentPw);
      if (!isValid) {
        setError("currentPw", { message: "현재 비밀번호가 올바르지 않습니다." });
        return;
      }

      const tasks: Promise<void>[] = [];
      if (data.phone !== (profile.phone ?? ""))
        tasks.push(updateMyPhone(user!.id, data.phone));
      if (data.newPw) tasks.push(updatePassword(data.newPw));
      if (isAlumni)
        tasks.push(
          updateMyCompanyInfo(user!.id, {
            company: data.company,
            job_title: data.jobTitle,
            is_company_public: data.companyPublic,
          }),
        );

      await Promise.all(tasks);
      queryClient.invalidateQueries({ queryKey: ["my-profile", user!.id] });
      reset({
        phone: data.phone,
        company: data.company,
        jobTitle: data.jobTitle,
        companyPublic: data.companyPublic,
        newPw: "",
        confirmPw: "",
        currentPw: "",
      });
      setSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSuccess(false), 2000);
    } catch {
      setError("currentPw", { message: "저장에 실패했습니다. 다시 시도해주세요." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {/* 기본 정보 (읽기 전용) */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-card px-6 py-5">
          <div className="flex items-center gap-1.5 mb-3">
            <h2 className="text-xs font-bold text-on-surface-variant">기본 정보</h2>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowInfoPopover((v) => !v)}
                className="flex items-center text-on-surface-variant/50 hover:text-on-surface-variant transition-colors"
              >
                <HelpIcon className="w-4 h-4" />
              </button>
              {showInfoPopover && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowInfoPopover(false)} />
                  <div className="absolute -left-3 top-6 z-20 w-56 bg-on-surface text-surface text-xs rounded-xl px-3.5 py-2.5 shadow-xl leading-relaxed">
                    <span className="absolute -top-1.5 left-3.5 w-3 h-3 bg-on-surface rotate-45 rounded-sm" />
                    기본 정보는 변경할 수 없습니다. 변경을 원하시면 관리자에게 문의해 주세요.
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="space-y-3">
            <InfoRow label="이메일" value={profile.email || "-"} />
            <InfoRow label="학과" value={profile.department ?? "-"} />
            <InfoRow
              label="학번"
              value={
                profile.admission_year
                  ? `${String(profile.admission_year).slice(-2)}학번`
                  : "-"
              }
            />
            <InfoRow label="기수" value={profile.generation ?? "-"} />
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-on-surface-variant w-14 shrink-0">
                회원 구분
              </span>
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

        {/* 마케팅 동의 */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-card px-6 py-5">
          <div className="flex items-center gap-1.5 mb-3">
            <h2 className="text-xs font-bold text-on-surface-variant">알림 수신</h2>
            <button
              type="button"
              onClick={() => setShowMarketingModal(true)}
              className="text-xs text-on-surface-variant/50 hover:text-primary-container underline underline-offset-2 transition-colors"
            >
              내용 보기
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-on-surface">마케팅 정보 수신 동의</p>
              <p className="text-xs text-on-surface-variant mt-0.5">
                동아리 소식 및 행사 안내를 이메일·문자로 받습니다
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={marketingAgree}
              onClick={handleMarketingToggle}
              disabled={updateMarketing.isPending}
              className={`w-12 h-7 rounded-full transition-colors relative shrink-0 disabled:opacity-60 ${marketingAgree ? "bg-primary-container" : "bg-surface-container-highest"}`}
            >
              <span
                className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${marketingAgree ? "translate-x-5" : "translate-x-0"}`}
              />
            </button>
          </div>
          {marketingSaved && (
            <p className="text-xs text-primary-container mt-2">저장되었습니다.</p>
          )}
        </div>

        {/* 정보 수정 */}
        {!isEditing ? (
          <div className="bg-surface-container-lowest rounded-2xl shadow-card px-6 py-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold text-on-surface-variant">추가 정보</h2>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-xs font-semibold text-primary-container hover:opacity-70 transition-opacity"
              >
                수정
              </button>
            </div>
            <div className="space-y-3">
              <InfoRow label="연락처" value={profile.phone || "-"} />
              {isAlumni && (
                <>
                  <InfoRow label="소속" value={profile.company || "-"} />
                  <InfoRow label="직함" value={profile.job_title || "-"} />
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-semibold text-on-surface-variant w-14 shrink-0">
                      공개 여부
                    </span>
                    <span className="text-sm text-on-surface">
                      {profile.is_company_public ? "공개" : "비공개"}
                    </span>
                  </div>
                </>
              )}
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-on-surface-variant w-14 shrink-0">
                  비밀번호
                </span>
                <span className="text-sm text-on-surface">••••••••</span>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-surface-container-lowest rounded-2xl shadow-card divide-y divide-outline-variant/10">
              {/* 연락처 */}
              <div className="px-6 py-5">
                <label className="text-xs font-bold text-on-surface-variant block mb-2">
                  연락처 <span className="text-error ml-0.5">*</span>
                </label>
                <input
                  type="tel"
                  {...register("phone", {
                    required: "연락처를 입력해주세요.",
                    pattern: {
                      value: /^01[0-9]\d{7,8}$/,
                      message: "올바른 연락처를 입력해주세요.",
                    },
                  })}
                  placeholder="01012345678"
                  className={inputCls(!!errors.phone)}
                />
                <FieldError message={errors.phone?.message} />
              </div>

              {/* 회사 정보 (졸업생만) */}
              {isAlumni && (
                <div className="px-6 py-5 space-y-3">
                  <label className="text-xs font-bold text-on-surface-variant block">
                    회사 정보
                  </label>
                  <div>
                    <label className="text-xs font-semibold text-on-surface-variant block mb-1">
                      소속{companyPublic && <span className="text-error ml-1">*</span>}
                    </label>
                    <input
                      type="text"
                      {...register("company", {
                        validate: (v) => {
                          if (companyPublic && !v.trim()) return "공개 시 소속을 입력해주세요.";
                          return true;
                        },
                      })}
                      placeholder="회사, 병원, 법률사무소 등"
                      className={inputCls(!!errors.company)}
                    />
                    <FieldError message={errors.company?.message} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-on-surface-variant block mb-1">
                      직함{" "}
                      <span className="font-normal text-on-surface-variant/60">(선택)</span>
                    </label>
                    <input
                      type="text"
                      {...register("jobTitle")}
                      placeholder="마케팅팀, 개발자, 개인 사업 등 자유롭게 입력해주세요"
                      className={inputCls(false)}
                    />
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <div>
                      <p className="text-sm font-semibold text-on-surface">공개 여부</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        선배님 페이지에 회사 정보를 공개합니다
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={companyPublic}
                      onClick={() => setValue("companyPublic", !companyPublic)}
                      className={`w-12 h-7 rounded-full transition-colors relative shrink-0 ${companyPublic ? "bg-primary-container" : "bg-surface-container-highest"}`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${companyPublic ? "translate-x-5" : "translate-x-0"}`}
                      />
                    </button>
                  </div>
                </div>
              )}

              {/* 비밀번호 변경 (선택) */}
              <div className="px-6 py-5 space-y-3">
                <label className="text-xs font-bold text-on-surface-variant block">
                  비밀번호 변경{" "}
                  <span className="font-normal text-on-surface-variant/60">(선택)</span>
                </label>
                <div>
                  <label className="text-xs font-semibold text-on-surface-variant block mb-1">
                    새 비밀번호
                  </label>
                  <input
                    type="password"
                    {...register("newPw", {
                      validate: (v) => {
                        if (!v) return true;
                        if (v.length < 8) return "8자 이상이어야 합니다.";
                        if (!PW_PATTERN.test(v))
                          return "영문, 숫자, 특수문자(!@#$%^&*)를 포함해야 합니다.";
                        return true;
                      },
                    })}
                    placeholder="변경 시에만 입력 (8자 이상)"
                    className={inputCls(!!errors.newPw)}
                  />
                  <FieldError message={errors.newPw?.message} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-on-surface-variant block mb-1">
                    새 비밀번호 확인
                  </label>
                  <input
                    type="password"
                    {...register("confirmPw", {
                      validate: (v) => {
                        const pw = getValues("newPw");
                        if (!pw) return true;
                        return v === pw || "새 비밀번호가 일치하지 않습니다.";
                      },
                    })}
                    placeholder="새 비밀번호를 다시 입력"
                    className={inputCls(!!errors.confirmPw)}
                  />
                  <FieldError message={errors.confirmPw?.message} />
                </div>
              </div>

              {/* 현재 비밀번호 + 저장/취소 */}
              <div className="px-6 py-5 space-y-3">
                <div>
                  <label className="text-xs font-bold text-on-surface-variant block mb-2">
                    현재 비밀번호 확인
                  </label>
                  <input
                    type="password"
                    {...register("currentPw", {
                      required: "현재 비밀번호를 입력해주세요.",
                    })}
                    placeholder="저장하려면 현재 비밀번호를 입력하세요"
                    className={inputCls(!!errors.currentPw)}
                  />
                  <FieldError message={errors.currentPw?.message} />
                </div>
                {success && (
                  <p className="text-xs text-primary-container">저장되었습니다.</p>
                )}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      reset({
                        phone: profile.phone ?? "",
                        company: profile.company ?? "",
                        jobTitle: profile.job_title ?? "",
                        companyPublic: profile.is_company_public ?? true,
                        newPw: "",
                        confirmPw: "",
                        currentPw: "",
                      });
                      setIsEditing(false);
                    }}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-surface-container text-on-surface-variant hover:opacity-70 transition-all"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-primary-container text-white hover:opacity-90 disabled:opacity-50 transition-all"
                  >
                    {saving ? "저장 중..." : "저장"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>

      {showTypeModal && (
        <AlumniTypeModal
          isPending={updateType.isPending}
          onConfirm={handleTypeChange}
          onClose={() => setShowTypeModal(false)}
        />
      )}
      <AgreementModal type={showMarketingModal ? "optional" : null} onClose={() => setShowMarketingModal(false)} />
    </>
  );
}
