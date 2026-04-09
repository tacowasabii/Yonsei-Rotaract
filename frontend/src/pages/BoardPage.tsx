import { useState } from "react";

const posts = [
  {
    id: 1,
    author: "김연세",
    grade: "21학번",
    time: "3분 전",
    title: "백양로 벚꽃 아래에서 사진 찍으실 분 구해요!",
    content:
      "내일 오후에 수업 끝나고 백양로 쪽에서 스냅사진 느낌으로 서로 찍어주실 분 계신가요? 필름 카메라 가져갈 예정입니다.",
    tags: ["일상", "사진"],
    likes: 24,
    comments: 8,
    views: 152,
  },
  {
    id: 2,
    author: "박서준",
    grade: "22학번",
    time: "1시간 전",
    title: "취업준비 하면서 로타랙트 활동이 도움된 것들",
    content:
      "요즘 취준 중인데 자소서 쓸 때 로타랙트 봉사활동 경험이 정말 많이 도움되더라구요. 특히 팀 협업과 기획 경험이... 혹시 다른 분들도 비슷한 경험 있으신가요?",
    tags: ["취업", "자소서"],
    likes: 38,
    comments: 15,
    views: 287,
  },
  {
    id: 3,
    author: "이지은",
    grade: "23학번",
    time: "4시간 전",
    title: "오늘 학식 뭐 먹었어요? 😊",
    content:
      "오늘 학관 파스타 먹었는데 진짜 맛있었어요ㅋㅋㅋ 요즘 학식 퀄리티가 올라간 것 같지 않나요? 다들 오늘 점심 어떻게 하셨나요?",
    tags: ["일상"],
    likes: 12,
    comments: 22,
    views: 98,
  },
  {
    id: 4,
    author: "최민호",
    grade: "20학번",
    time: "6시간 전",
    title: "경영학과 수업 같이 들을 스터디 구합니다",
    content:
      "2학기 경영전략론 스터디 구해요. 주 1회 2시간 정도 함께 공부할 분 환영합니다. 조모임 경험 있으신 분이면 더 좋아요!",
    tags: ["스터디", "경영"],
    likes: 9,
    comments: 6,
    views: 134,
  },
  {
    id: 5,
    author: "한소희",
    grade: "24학번",
    time: "1일 전",
    title: "로타랙트 첫 활동 후기 (새내기입니다)",
    content:
      "저번 주에 봉사활동 처음 참여했는데 너무 좋았어요! 선배님들이 정말 친절하게 챙겨주셔서 감동받았습니다. 앞으로도 열심히 활동하고 싶어요 :)",
    tags: ["신입", "후기"],
    likes: 47,
    comments: 19,
    views: 321,
  },
  {
    id: 6,
    author: "정우성",
    grade: "21학번",
    time: "2일 전",
    title: "MT 장소 추천해주세요~",
    content:
      "다음 달 MT 장소 물색 중인데 경기도 근처 좋은 곳 아시는 분 계세요? 20명 정도 들어갈 수 있는 펜션이나 글램핑장 추천 환영합니다!",
    tags: ["MT", "모임"],
    likes: 18,
    comments: 31,
    views: 203,
  },
];

export default function BoardPage() {
  const [sortBy, setSortBy] = useState<"recent" | "popular">("recent");

  const sorted = [...posts].sort((a, b) =>
    sortBy === "popular" ? b.likes - a.likes : b.id - a.id
  );

  return (
    <main className="max-w-4xl mx-auto px-4 md:px-8 pt-24 pb-24 md:pb-12">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="material-symbols-outlined text-primary-container text-3xl">forum</span>
          <h1 className="text-4xl font-extrabold text-on-surface tracking-tight font-headline">
            자유게시판
          </h1>
        </div>
        <p className="text-on-surface-variant">회원들과 자유롭게 소통하는 공간입니다.</p>
      </header>

      {/* Toolbar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy("recent")}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              sortBy === "recent"
                ? "bg-primary-container text-white"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            최신순
          </button>
          <button
            onClick={() => setSortBy("popular")}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              sortBy === "popular"
                ? "bg-primary-container text-white"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            인기순
          </button>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-container text-white text-sm font-bold rounded-full hover:opacity-90 transition-all">
          <span className="material-symbols-outlined text-base">edit</span>
          글쓰기
        </button>
      </div>

      {/* Post List */}
      <div className="space-y-4">
        {sorted.map((post) => (
          <div
            key={post.id}
            className="bg-surface-container-lowest rounded-2xl p-5 shadow-card hover:bg-primary-fixed/10 transition-all cursor-pointer"
          >
            {/* Author */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-secondary-fixed flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-on-secondary-fixed-variant text-xl">
                  account_circle
                </span>
              </div>
              <div>
                <span className="text-sm font-semibold text-on-surface">{post.author}</span>
                <span className="text-xs text-on-surface-variant ml-2">{post.grade}</span>
              </div>
              <span className="text-xs text-on-surface-variant ml-auto">{post.time}</span>
            </div>

            {/* Content */}
            <h3 className="font-bold text-on-surface mb-1">{post.title}</h3>
            <p className="text-sm text-on-surface-variant line-clamp-2 mb-3">{post.content}</p>

            {/* Tags */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-semibold text-primary-container bg-primary-fixed/50 px-2 py-0.5 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-[11px] text-on-surface-variant border-t border-outline-variant/20 pt-3">
              <button className="flex items-center gap-1 hover:text-error transition-colors">
                <span
                  className="material-symbols-outlined text-xs"
                  style={{ fontVariationSettings: '"FILL" 1' }}
                >
                  favorite
                </span>
                <span>{post.likes}</span>
              </button>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">chat_bubble</span>
                <span>{post.comments}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">visibility</span>
                <span>{post.views}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-10">
        {[1, 2, 3, 4, 5].map((p) => (
          <button
            key={p}
            className={`w-9 h-9 rounded-full text-sm font-semibold transition-all ${
              p === 1
                ? "bg-primary-container text-white"
                : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
    </main>
  );
}
