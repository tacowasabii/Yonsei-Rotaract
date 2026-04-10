import { useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import PageHeader from "../components/layout/PageHeader";

const alumni = [
  {
    name: "김도현",
    gradYear: "16학번",
    major: "경영학과",
    company: "삼성전자",
    field: "마케팅",
    advice: "대학 때 다양한 사람들과 어울리는 것이 가장 큰 자산이 됐습니다. 로타랙트에서 만난 인연들이 지금도 큰 힘이 돼요.",
    tags: ["대기업", "마케팅"],
    avatar: "person",
  },
  {
    name: "이수진",
    gradYear: "17학번",
    major: "사회학과",
    company: "카카오",
    field: "UX 리서치",
    advice: "봉사활동 하면서 키운 공감 능력이 UX 업무에 정말 큰 도움이 되고 있어요. 사람을 이해하는 능력을 꼭 키우세요.",
    tags: ["IT", "UX"],
    avatar: "person",
  },
  {
    name: "박준혁",
    gradYear: "15학번",
    major: "전기전자공학과",
    company: "스타트업 창업",
    field: "기술 창업",
    advice: "실패를 두려워하지 마세요. 로타랙트에서 배운 팀워크와 리더십이 창업의 기반이 됐습니다.",
    tags: ["스타트업", "창업"],
    avatar: "person",
  },
  {
    name: "최아름",
    gradYear: "18학번",
    major: "언론정보학과",
    company: "JTBC",
    field: "방송 제작",
    advice: "컨텐츠 기획 경험이 방송 업무에 큰 도움이 됐어요. 동아리 활동을 단순히 취미로만 생각하지 말고 진지하게 임해보세요.",
    tags: ["미디어", "방송"],
    avatar: "person",
  },
  {
    name: "장민서",
    gradYear: "19학번",
    major: "의류환경학과",
    company: "LG전자",
    field: "상품기획",
    advice: "전공과 관련 없는 분야로 취업해도 괜찮아요. 스펙보다는 어떤 문제를 해결했는지, 어떻게 성장했는지가 중요합니다.",
    tags: ["대기업", "기획"],
    avatar: "person",
  },
  {
    name: "오지훈",
    gradYear: "16학번",
    major: "경제학과",
    company: "KB국민은행",
    field: "금융",
    advice: "금융권은 인적 네트워크가 중요해요. 로타랙트처럼 다양한 사람들과 교류할 수 있는 활동을 꼭 해보시길 추천드립니다.",
    tags: ["금융", "은행"],
    avatar: "person",
  },
  {
    name: "유하나",
    gradYear: "20학번",
    major: "사회복지학과",
    company: "사회복지법인",
    field: "NGO/NPO",
    advice: "봉사활동이 삶의 방향을 잡는 데 정말 많은 도움이 됐습니다. 나눔이 직업이 될 수 있다는 걸 알게 됐어요.",
    tags: ["NGO", "사회공헌"],
    avatar: "person",
  },
  {
    name: "신동우",
    gradYear: "17학번",
    major: "컴퓨터과학과",
    company: "네이버",
    field: "소프트웨어 개발",
    advice: "개발자로서 커뮤니케이션 능력이 코딩만큼 중요해요. 동아리 활동에서 키운 소통 능력이 팀 프로젝트에서 빛을 발합니다.",
    tags: ["IT", "개발"],
    avatar: "person",
  },
];

const fieldFilters = ["전체", "IT", "대기업", "금융", "미디어", "스타트업", "NGO"];
const yearFilters = ["전체", "15~17학번", "18~20학번", "21학번+"];

export default function AlumniPage() {
  const [activeField, setActiveField] = useState("전체");
  const [activeYear, setActiveYear] = useState("전체");
  const [search, setSearch] = useState("");

  const filtered = alumni.filter((a) => {
    const matchField =
      activeField === "전체" || a.tags.includes(activeField);
    const matchYear =
      activeYear === "전체" ||
      (activeYear === "15~17학번" && ["15학번", "16학번", "17학번"].includes(a.gradYear)) ||
      (activeYear === "18~20학번" && ["18학번", "19학번", "20학번"].includes(a.gradYear)) ||
      (activeYear === "21학번+" && ["21학번", "22학번", "23학번", "24학번"].includes(a.gradYear));
    const matchSearch =
      !search ||
      a.name.includes(search) ||
      a.company.includes(search) ||
      a.field.includes(search) ||
      a.major.includes(search);
    return matchField && matchYear && matchSearch;
  });

  return (
    <PageLayout>
      <PageHeader icon="school" title="선배님 정보" subtitle="다양한 분야에서 활약 중인 로타랙트 선배님들을 만나보세요." />

      {/* Search */}
      <div className="relative mb-6">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
          search
        </span>
        <input
          type="text"
          placeholder="이름, 회사, 직군으로 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-surface-container-lowest rounded-2xl text-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary-container/30 shadow-card"
        />
      </div>

      {/* Filters */}
      <div className="space-y-3 mb-8">
        <div className="flex gap-2 flex-wrap">
          <span className="text-xs font-bold text-on-surface-variant self-center mr-1">직군</span>
          {fieldFilters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveField(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                activeField === f
                  ? "bg-primary-container text-white"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          <span className="text-xs font-bold text-on-surface-variant self-center mr-1">기수</span>
          {yearFilters.map((y) => (
            <button
              key={y}
              onClick={() => setActiveYear(y)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                activeYear === y
                  ? "bg-secondary-fixed text-on-secondary-fixed"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      {/* Alumni Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-on-surface-variant">
          <span className="material-symbols-outlined text-5xl mb-4 block">search_off</span>
          <p>검색 결과가 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((person, i) => (
            <div
              key={i}
              className="bg-surface-container-lowest rounded-2xl p-6 shadow-card hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
            >
              {/* Avatar */}
              <div className="flex flex-col items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-secondary-fixed flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-3xl text-on-secondary-fixed-variant">
                    {person.avatar}
                  </span>
                </div>
                <h3 className="font-headline font-bold text-lg text-on-surface">{person.name}</h3>
                <p className="text-xs text-on-surface-variant">{person.gradYear} · {person.major}</p>
              </div>

              {/* Company & Field */}
              <div className="bg-primary-fixed/40 rounded-xl p-3 mb-4 text-center">
                <p className="text-sm font-bold text-primary-container">{person.company}</p>
                <p className="text-xs text-on-surface-variant">{person.field}</p>
              </div>

              {/* Tags */}
              <div className="flex gap-1 flex-wrap justify-center mb-4">
                {person.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-semibold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Advice */}
              <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3 italic border-t border-outline-variant/20 pt-3">
                "{person.advice}"
              </p>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
