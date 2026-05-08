import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DONATION_ACCOUNT } from "@/constants/donation";
import { useAuth } from "@/contexts/AuthContext";
import { PATHS } from "@/routes/paths";
import PageLayout from "@components/layout/PageLayout";
import PageHeader from "@components/layout/PageHeader";
import { FavoriteFillIcon, PersonIcon, AccountBalanceIcon, CheckIcon, ContentCopyIcon, VolunteerActivismIcon, SpinnerIcon } from "@assets/icons";
import DonationFormModal from "./components/DonationFormModal";
import { usePublicDonations } from "@/api/hooks/donations/usePublicDonations";
import { usePublicDonationYears } from "@/api/hooks/donations/usePublicDonationYears";
import type { PublicDonation } from "@/api/types/donation";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default function DonatePage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);
  const [copiedAccount, setCopiedAccount] = useState(false);

  const { data: years = [] } = usePublicDonationYears();

  // 연도 목록이 로드되면 가장 최근 연도를 기본값으로 설정
  const currentYear = selectedYear ?? years[0];

  const { data: donations = [], isLoading } = usePublicDonations(currentYear);

  function handleCopyAccount() {
    navigator.clipboard.writeText(DONATION_ACCOUNT.number).then(() => {
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2000);
    });
  }

  function handleDonateClick() {
    if (!profile) {
      navigate(PATHS.LOGIN);
      return;
    }
    setShowModal(true);
  }

  return (
    <PageLayout>
      <PageHeader
        iconNode={<FavoriteFillIcon />}
        title="명예의 전당"
        subtitle="연세 로타랙트는 오직 후원금으로 운영됩니다. 소중한 후원으로 함께해 주신 분들을 기억합니다."
      >
        <button
          onClick={handleDonateClick}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-container text-white font-bold rounded-2xl shadow-card hover:opacity-90 active:scale-95 transition-all text-sm shrink-0"
        >
          <VolunteerActivismIcon className="w-5 h-5" />
          후원 신청하기
        </button>
      </PageHeader>

      {/* 계좌 안내 배너 */}
      <div className="flex items-center gap-4 bg-primary-fixed/30 border border-primary-fixed rounded-2xl px-6 py-4 mb-8">
        <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center shrink-0">
          <AccountBalanceIcon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-primary-container mb-0.5">
            후원 계좌
          </p>
          <div className="flex items-center gap-1.5">
            <p className="font-black text-primary-container tracking-wide">
              {DONATION_ACCOUNT.bank} {DONATION_ACCOUNT.number}
            </p>
            <button onClick={handleCopyAccount} className="text-primary-container/60 hover:text-primary-container transition-colors shrink-0">
              {copiedAccount
                ? <CheckIcon className="w-4 h-4" />
                : <ContentCopyIcon className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-on-surface-variant">
            예금주: {DONATION_ACCOUNT.holder}
          </p>
        </div>
        <p className="text-xs text-on-surface-variant text-right hidden sm:block leading-relaxed">
          입금 후 후원 신청하시면
          <br />
          관리자 확인 후 등록됩니다
        </p>
      </div>

      {/* 연도 필터 */}
      {years.length > 0 && (
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                currentYear === year
                  ? "bg-primary-container text-white"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {year}년
            </button>
          ))}
        </div>
      )}

      {/* 후원자 목록 */}
      <div className="flex items-center gap-2 mb-5">
        <span
          className="material-symbols-outlined text-primary-container"
          style={{ fontVariationSettings: '"FILL" 1' }}
        >
          workspace_premium
        </span>
        <h2 className="text-lg font-black font-headline text-on-surface">
          {currentYear ? `${currentYear}년 후원자 명단` : "후원자 명단"}
        </h2>
        <span className="ml-auto text-sm text-on-surface-variant">
          {isLoading ? "..." : `${donations.length}명`}
        </span>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-on-surface-variant">
          <SpinnerIcon className="w-8 h-8 animate-spin" />
        </div>
      ) : donations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant gap-2">
          <span className="material-symbols-outlined text-4xl">inbox</span>
          <p className="text-sm font-semibold">
            {currentYear ? `${currentYear}년 후원자가 없습니다` : "아직 등록된 후원자가 없습니다"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {donations.map((d) => (
            <DonationCard key={d.id} donation={d} />
          ))}
        </div>
      )}

      {showModal && (
        <DonationFormModal onClose={() => setShowModal(false)} />
      )}
    </PageLayout>
  );
}

function DonationCard({ donation }: { donation: PublicDonation }) {
  const { is_anonymous, message, approved_at, profiles } = donation;
  const displayName = is_anonymous ? "익명의 후원자" : (profiles?.name ?? "-");

  const meta =
    !is_anonymous && profiles
      ? [
          profiles.department,
          profiles.admission_year
            ? `${String(profiles.admission_year).slice(-2)}학번`
            : null,
          profiles.generation ?? null,
        ]
          .filter(Boolean)
          .join(" · ")
      : null;

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-card p-5 flex flex-col gap-3 hover:shadow-lg hover:-translate-y-0.5 transition-all">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
            is_anonymous ? "bg-surface-container" : "bg-primary-fixed"
          }`}
        >
          {is_anonymous ? (
            <PersonIcon className="w-5 h-5 text-on-surface-variant" />
          ) : (
            <FavoriteFillIcon className="w-5 h-5 text-primary-container" />
          )}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-on-surface truncate">{displayName}</p>
          {meta && (
            <p className="text-xs text-on-surface-variant truncate">{meta}</p>
          )}
        </div>
      </div>

      {message && (
        <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-3 border-l-2 border-primary-fixed pl-3">
          "{message}"
        </p>
      )}

      <p className="text-xs text-on-surface-variant mt-auto">
        {formatDate(approved_at)}
      </p>
    </div>
  );
}
