import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PATHS } from "@/routes/paths";
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

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default function DonatePage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  function handleDonateClick() {
    if (!profile) {
      navigate(PATHS.LOGIN);
      return;
    }
    setShowModal(true);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* 히어로 배너 */}
      <header className="p-8 md:p-10 rounded-3xl bg-linear-to-br from-primary to-primary-container relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-1/2 -left-1/5 w-[150%] h-[150%] bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-size-[20px_20px]" />
        </div>
        <div className="relative z-10 text-white">
          <div className="flex items-center gap-2.5 mb-3">
            <span
              className="material-symbols-outlined text-3xl"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              favorite
            </span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight font-headline">
              명예의 전당
            </h1>
          </div>
          <p className="text-on-primary-container text-base opacity-90 max-w-xl mb-6">
            연세 로타랙트는 오직 후원금으로 운영됩니다. 소중한 후원으로
            함께해 주신 분들을 기억합니다.
          </p>

          {/* 계좌 안내 */}
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur rounded-2xl px-5 py-3 mb-6">
            <span className="material-symbols-outlined text-xl">
              account_balance
            </span>
            <div>
              <p className="text-xs font-bold opacity-60 mb-0.5">후원 계좌</p>
              <p className="text-sm font-black tracking-wide">
                신한은행 110-000-000000
              </p>
              <p className="text-xs opacity-60">예금주: 연세대학교 로타랙트</p>
            </div>
          </div>

          <div>
            <button
              onClick={handleDonateClick}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-container font-black rounded-2xl shadow-lg hover:opacity-90 active:scale-95 transition-all text-sm"
            >
              <span
                className="material-symbols-outlined text-lg"
                style={{ fontVariationSettings: '"FILL" 1' }}
              >
                volunteer_activism
              </span>
              후원 신청하기
            </button>
          </div>
        </div>
      </header>

      {/* 후원자 목록 */}
      <section>
        <div className="flex items-center gap-2 mb-5">
          <span
            className="material-symbols-outlined text-primary-container"
            style={{ fontVariationSettings: '"FILL" 1' }}
          >
            workspace_premium
          </span>
          <h2 className="text-lg font-black font-headline text-on-surface">
            후원자 명단
          </h2>
          <span className="ml-auto text-sm text-on-surface-variant">
            {MOCK_DONATIONS.length}명이 함께하고 있습니다
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_DONATIONS.map((d) => (
            <DonationCard key={d.id} donation={d} />
          ))}
        </div>
      </section>

      {showModal && (
        <DonationFormModal onClose={() => setShowModal(false)} />
      )}
    </div>
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
    <div className="bg-surface-container-lowest rounded-2xl shadow-card p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
            is_anonymous ? "bg-surface-container" : "bg-primary-fixed"
          }`}
        >
          <span
            className={`material-symbols-outlined text-lg ${
              is_anonymous ? "text-on-surface-variant" : "text-primary-container"
            }`}
            style={
              is_anonymous
                ? undefined
                : { fontVariationSettings: '"FILL" 1' }
            }
          >
            {is_anonymous ? "person" : "favorite"}
          </span>
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
