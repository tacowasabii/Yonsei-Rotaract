import { useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import PageHeader from "../components/layout/PageHeader";

const categories = ["전체", "동아리 소식", "봉사활동", "이벤트", "공지"];

const newsPosts = [
  {
    category: "봉사활동",
    title: "안산 연희동 벽화 그리기 봉사활동 현장 사진",
    excerpt: "지난 주말, 연희동 일대에서 진행된 벽화 봉사활동 현장 사진들이 공유되었습니다. 40여 명의 회원이 참여해 성공적으로 마무리했습니다.",
    author: "박지민",
    date: "2025. 04. 08",
    likes: 42,
    comments: 12,
    views: 310,
    image: true,
    featured: true,
  },
  {
    category: "동아리 소식",
    title: "2025 대동제 부스 기획안 최종 선정 결과 발표",
    excerpt: "총 8개 팀이 제출한 기획안 중 최종 3개 팀이 선정되었습니다. 선정된 팀들은 다음 주 OT에서 발표할 예정입니다.",
    author: "이수현",
    date: "2025. 04. 06",
    likes: 35,
    comments: 19,
    views: 428,
    image: false,
    featured: false,
  },
  {
    category: "이벤트",
    title: "신촌 무료급식소 월례 봉사 참여 후기",
    excerpt: "이번 달도 신촌 무료급식소 봉사에 20명의 회원이 함께했습니다. 처음 참여한 새내기 회원들의 소감도 함께 담았습니다.",
    author: "김태양",
    date: "2025. 04. 04",
    likes: 28,
    comments: 7,
    views: 196,
    image: true,
    featured: false,
  },
  {
    category: "동아리 소식",
    title: "4월 정기 집회 안내 및 아젠다 공유",
    excerpt: "이번 달 정기 집회는 4월 15일 오후 7시, 공학원 세미나실에서 열립니다. 아젠다는 신입 회원 소개, 봉사활동 계획 논의 등입니다.",
    author: "최윤서",
    date: "2025. 04. 02",
    likes: 15,
    comments: 4,
    views: 243,
    image: false,
    featured: false,
  },
  {
    category: "봉사활동",
    title: "연세대 학교 앞 환경 정화 봉사 모집",
    excerpt: "4월 20일 오전 10시, 연세대 정문 앞 환경 정화 봉사를 진행합니다. 선착순 25명 모집이며, 참여 신청은 댓글로 남겨주세요.",
    author: "정하은",
    date: "2025. 03. 30",
    likes: 22,
    comments: 14,
    views: 301,
    image: false,
    featured: false,
  },
  {
    category: "이벤트",
    title: "로타랙트 OB/YB 연합 MT 사진 모음",
    excerpt: "지난 3월 말 진행된 OB/YB 연합 MT 사진들이 공유되었습니다. 많은 졸업 선배님들도 참석해 즐거운 시간을 보냈습니다.",
    author: "오민준",
    date: "2025. 03. 28",
    likes: 63,
    comments: 21,
    views: 512,
    image: true,
    featured: false,
  },
];

const bgColors = [
  "bg-primary-fixed/30",
  "bg-secondary-fixed/30",
  "bg-tertiary-fixed/30",
  "bg-surface-variant",
];

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState("전체");

  const filtered =
    activeCategory === "전체"
      ? newsPosts
      : newsPosts.filter((p) => p.category === activeCategory);

  const featured = filtered.find((p) => p.featured) ?? filtered[0];
  const rest = filtered.filter((p) => p !== featured);

  return (
    <PageLayout>
            <PageHeader title="소식" subtitle="연세 로타랙트의 활동 소식과 이벤트를 확인하세요." />

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              activeCategory === cat
                ? "bg-primary-container text-white"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Post */}
      {featured && (
        <div className="relative overflow-hidden rounded-2xl h-72 mb-8 cursor-pointer group shadow-xl">
          <div
            className={`absolute inset-0 ${bgColors[0]} bg-linear-to-br from-primary-container/60 to-primary`}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
          <div className="relative z-10 flex flex-col justify-end h-full p-8">
            <span className="text-xs font-bold text-tertiary-container bg-tertiary-fixed/20 border border-tertiary-container/30 px-3 py-1 rounded-full mb-3 inline-block w-fit">
              {featured.category}
            </span>
            <h2 className="text-2xl md:text-3xl font-headline font-extrabold text-white mb-2">
              {featured.title}
            </h2>
            <p className="text-white/70 text-sm max-w-xl line-clamp-2">{featured.excerpt}</p>
            <div className="flex items-center gap-4 mt-4 text-white/60 text-xs">
              <span>{featured.author}</span>
              <span>{featured.date}</span>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">favorite</span>
                <span>{featured.likes}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rest.map((post, i) => (
          <div
            key={i}
            className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-card hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group"
          >
            {post.image && (
              <div
                className={`h-40 ${bgColors[i % bgColors.length]} flex items-center justify-center`}
              >
                <span className="material-symbols-outlined text-5xl text-on-surface-variant/30">
                  image
                </span>
              </div>
            )}
            <div className="p-5">
              <span className="text-[11px] font-bold text-primary-container bg-primary-fixed px-2 py-0.5 rounded">
                {post.category}
              </span>
              <h3 className="font-bold text-on-surface mt-2 mb-1 line-clamp-2 group-hover:text-primary-container transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-on-surface-variant line-clamp-2 mb-4">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
                <span>{post.author} · {post.date}</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">favorite</span>
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">chat_bubble</span>
                    <span>{post.comments}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
