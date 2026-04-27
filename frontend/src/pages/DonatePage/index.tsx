import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PATHS } from "@/routes/paths";
import PageLayout from "@components/layout/PageLayout";
import PageHeader from "@components/layout/PageHeader";
import { FavoriteFillIcon, PersonIcon } from "@assets/icons";
import DonationFormModal from "./components/DonationFormModal";

interface DonationEntry {
  id: string;
  is_anonymous: boolean;
  message: string | null;
  approved_at: string;
  profile: {
    name: string;
    department: string | null;
    admission_year: number | null;
    generation: string | null;
  } | null;
}

const MOCK_DONATIONS: DonationEntry[] = [
  // 2026
  {
    id: "7",
    is_anonymous: false,
    message: "올해도 로타랙트와 함께합니다!",
    approved_at: "2026-01-10T10:00:00Z",
    profile: { name: "정다은", department: "간호학과", admission_year: 2022, generation: "37기" },
  },
  {
    id: "8",
    is_anonymous: true,
    message: "늘 응원합니다.",
    approved_at: "2026-02-14T10:00:00Z",
    profile: null,
  },
  {
    id: "9",
    is_anonymous: false,
    message: null,
    approved_at: "2026-03-05T10:00:00Z",
    profile: { name: "한승우", department: "전기전자공학과", admission_year: 2021, generation: "36기" },
  },
  // 2025
  {
    id: "1",
    is_anonymous: false,
    message: "로타랙트 화이팅! 앞으로도 좋은 활동 많이 해주세요.",
    approved_at: "2025-03-15T10:00:00Z",
    profile: { name: "김민준", department: "경영학과", admission_year: 2020, generation: "35기" },
  },
  {
    id: "2",
    is_anonymous: true,
    message: "항상 응원합니다. 좋은 활동 계속 이어가세요!",
    approved_at: "2025-03-20T10:00:00Z",
    profile: null,
  },
  {
    id: "3",
    is_anonymous: false,
    message: null,
    approved_at: "2025-04-01T10:00:00Z",
    profile: { name: "이서연", department: "심리학과", admission_year: 2019, generation: "34기" },
  },
  {
    id: "4",
    is_anonymous: true,
    message: "작은 도움이 큰 변화를 만들 수 있다고 믿습니다.",
    approved_at: "2025-04-10T10:00:00Z",
    profile: null,
  },
  {
    id: "5",
    is_anonymous: false,
    message: "졸업 후에도 항상 응원하고 있어요!",
    approved_at: "2025-04-15T10:00:00Z",
    profile: { name: "박지호", department: "컴퓨터과학과", admission_year: 2018, generation: "33기" },
  },
  {
    id: "6",
    is_anonymous: false,
    message: "봉사의 가치를 믿습니다.",
    approved_at: "2025-04-18T10:00:00Z",
    profile: { name: "최유진", department: "사회학과", admission_year: 2021, generation: "36기" },
  },
];

const CURRENT_YEAR = new Date().getFullYear();

const YEARS = Array.from(
  new Set(MOCK_DONATIONS.map((d) => new Date(d.approved_at).getFullYear()))
).sort((a, b) => b - a);

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default function DonatePage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);

  const filtered = MOCK_DONATIONS.filter(
    (d) => new Date(d.approved_at).getFullYear() === selectedYear
  );

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
          <span
            className="material-symbols-outlined text-lg"
            style={{ fontVariationSettings: '"FILL" 1' }}
          >
            volunteer_activism
          </span>
          후원 신청하기
        </button>
      </PageHeader>

      {/* 계좌 안내 배너 */}
      <div className="flex items-center gap-4 bg-primary-fixed/30 border border-primary-fixed rounded-2xl px-6 py-4 mb-8">
        <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-white text-xl">
            account_balance
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-primary-container mb-0.5">
            후원 계좌
          </p>
          <p className="font-black text-primary-container tracking-wide">
            신한은행 110-000-000000
          </p>
          <p className="text-xs text-on-surface-variant">
            예금주: 연세대학교 로타랙트
          </p>
        </div>
        <p className="text-xs text-on-surface-variant text-right hidden sm:block leading-relaxed">
          입금 후 후원 신청하시면
          <br />
          관리자 확인 후 등록됩니다
        </p>
      </div>

      {/* 연도 필터 */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {YEARS.map((year) => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              selectedYear === year
                ? "bg-primary-container text-white"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            {year}년
          </button>
        ))}
      </div>

      {/* 후원자 목록 */}
      <div className="flex items-center gap-2 mb-5">
        <span
          className="material-symbols-outlined text-primary-container"
          style={{ fontVariationSettings: '"FILL" 1' }}
        >
          workspace_premium
        </span>
        <h2 className="text-lg font-black font-headline text-on-surface">
          {selectedYear}년 후원자 명단
        </h2>
        <span className="ml-auto text-sm text-on-surface-variant">
          {filtered.length}명
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant gap-2">
          <span className="material-symbols-outlined text-4xl">inbox</span>
          <p className="text-sm font-semibold">
            {selectedYear}년 후원자가 없습니다
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((d) => (
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

function DonationCard({ donation }: { donation: DonationEntry }) {
  const { is_anonymous, message, approved_at, profile } = donation;
  const displayName = is_anonymous ? "익명의 후원자" : (profile?.name ?? "-");

  const meta =
    !is_anonymous && profile
      ? [
          profile.department,
          profile.admission_year
            ? `${String(profile.admission_year).slice(-2)}학번`
            : null,
          profile.generation ?? null,
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
