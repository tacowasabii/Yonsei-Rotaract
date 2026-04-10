import { useState } from "react";
import { useLocation } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout";
import PageHeader from "../components/layout/PageHeader";

const noticePosts = [
  { id: "notice", num: null, title: "[필독] 2025년도 2학기 동아리 활동 가이드라인 안내", author: "관리자", date: "25.01.10", views: 1240, comments: 0, pinned: true },
  { id: "notice2", num: null, title: "3월 정기 모임 참가 신청 안내 (선착순 30명)", author: "운영위원회", date: "25.01.08", views: 856, comments: 0, pinned: false },
];

const freePosts = [
  { id: 1, num: 482, title: "백양로 벚꽃 아래에서 사진 찍으실 분 구해요!", author: "김연세", verified: true, date: "25.01.12", views: 152, comments: 8 },
  { id: 2, num: 481, title: "취업준비 하면서 로타랙트 활동이 도움된 것들", author: "박서준", verified: false, date: "25.01.12", views: 287, comments: 15 },
  { id: 3, num: 480, title: "오늘 학식 뭐 먹었어요? 😊", author: "이지은", verified: false, date: "25.01.11", views: 98, comments: 22 },
  { id: 4, num: 479, title: "경영학과 수업 같이 들을 스터디 구합니다", author: "최민호", verified: true, date: "25.01.11", views: 134, comments: 6 },
  { id: 5, num: 478, title: "로타랙트 첫 활동 후기 (새내기입니다)", author: "한소희", verified: false, date: "25.01.10", views: 321, comments: 19 },
  { id: 6, num: 477, title: "MT 장소 추천해주세요~", author: "정우성", verified: false, date: "25.01.09", views: 203, comments: 31 },
  { id: 7, num: 476, title: "동아리방 에어컨 리모컨 위치 아시는 분 계신가요...", author: "최수연", verified: false, date: "25.01.09", views: 56, comments: 2 },
];

const promoPosts = [
  { id: 1, num: 88, title: "🎨 연세 로타랙트 2025 봄 신입부원 모집!", author: "운영위원회", verified: true, date: "25.01.12", views: 520, comments: 14 },
  { id: 2, num: 87, title: "봉사활동 파트너 단체 모집 — 같이 만들어가요", author: "기획팀", verified: true, date: "25.01.11", views: 334, comments: 7 },
  { id: 3, num: 86, title: "로타랙트 스터디 그룹 멤버 모집 (영어 회화)", author: "이지은", verified: false, date: "25.01.10", views: 178, comments: 5 },
  { id: 4, num: 85, title: "중고 전공서적 나눔합니다 — 경영·경제 전공 다수", author: "박서준", verified: false, date: "25.01.09", views: 203, comments: 11 },
  { id: 5, num: 84, title: "2025 상반기 봉사활동 일정 공유해요!", author: "김연세", verified: true, date: "25.01.08", views: 445, comments: 23 },
];


export default function BoardPage() {
  const location = useLocation();
  const isPromo = location.pathname === "/board/promo";
  const boardLabel = isPromo ? "홍보게시판" : "자유게시판";
  const boardDesc = isPromo
    ? "모집·홍보·나눔 등 공유하고 싶은 소식을 올려보세요."
    : "회원들과 자유롭게 소통하는 공간입니다.";

  const regularPosts = isPromo ? promoPosts : freePosts;

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  return (
    <PageLayout>
      {/* Hero Header */}
      <PageHeader title={boardLabel} subtitle={boardDesc} />

      {/* Search bar + Write button */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <div className="relative w-full max-w-sm">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="검색어를 입력하세요..."
            className="w-full pl-11 pr-4 py-2.5 bg-surface-container-lowest rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-container/30 transition-all placeholder:text-on-surface-variant shadow-card"
          />
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-primary-container text-white font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all text-sm shrink-0">
          <span className="material-symbols-outlined text-[18px]">edit</span>
          글쓰기
        </button>
      </div>

      {/* Board Container */}
      <div className="bg-surface-container-low rounded-2xl overflow-hidden">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-fixed border-separate border-spacing-y-0.5">
            <thead>
              <tr className="bg-surface-container text-on-surface-variant text-sm font-semibold">
                <th className="py-4 px-4 text-center w-16">번호</th>
                <th className="py-4 px-4 text-left w-1/2">제목</th>
                <th className="py-4 px-4 text-center w-24 hidden sm:table-cell">글쓴이</th>
                <th className="py-4 px-4 text-center w-24 hidden md:table-cell">날짜</th>
                <th className="py-4 px-4 text-center w-20 hidden md:table-cell">조회수</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {/* Notice rows */}
              {noticePosts.map((post) => (
                <tr
                  key={post.id}
                  className="bg-secondary-fixed/30 hover:bg-secondary-fixed/50 transition-colors cursor-pointer"
                >
                  <td className="py-4 px-4 text-center">
                    <span className="bg-primary-container text-white px-2 py-0.5 rounded text-[10px] font-bold">
                      공지
                    </span>
                  </td>
                  <td className="py-4 px-4 font-bold text-primary-container max-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="truncate">{post.title}</span>
                      {post.pinned && (
                        <span
                          className="material-symbols-outlined text-sm shrink-0"
                          style={{ fontVariationSettings: '"FILL" 1' }}
                        >
                          push_pin
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center text-on-surface-variant hidden sm:table-cell">
                    {post.author}
                  </td>
                  <td className="py-4 px-4 text-center text-on-surface-variant hidden md:table-cell">
                    {post.date}
                  </td>
                  <td className="py-4 px-4 text-center text-on-surface-variant hidden md:table-cell">
                    {post.views.toLocaleString()}
                  </td>
                </tr>
              ))}

              {/* Divider */}
              <tr>
                <td colSpan={5} className="h-px bg-outline-variant/20 p-0" />
              </tr>

              {/* Regular posts */}
              {regularPosts.map((post) => (
                <tr
                  key={post.id}
                  className="hover:bg-surface-container-lowest transition-colors cursor-pointer group bg-white"
                >
                  <td className="py-4 px-4 text-center text-on-surface-variant">{post.num}</td>
                  <td className="py-4 px-4 text-on-surface group-hover:text-primary-container transition-colors font-medium">
                    {post.title}
                    {post.comments > 0 && (
                      <span className="text-tertiary-container font-bold text-xs ml-1.5">
                        [{post.comments}]
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center hidden sm:table-cell">
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-on-surface-variant">{post.author}</span>
                      {post.verified && (
                        <span
                          className="material-symbols-outlined text-sm text-surface-tint"
                          style={{ fontVariationSettings: '"FILL" 1' }}
                        >
                          verified
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center text-on-surface-variant hidden md:table-cell">
                    {post.date}
                  </td>
                  <td className="py-4 px-4 text-center text-on-surface-variant hidden md:table-cell">
                    {post.views}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer: pagination + write */}
        <div className="p-5 bg-surface-container-low flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Pagination */}
          <div className="flex items-center gap-1.5">
            <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors text-on-surface-variant">
              <span className="material-symbols-outlined text-xl">chevron_left</span>
            </button>
            {[1, 2, 3, 4, 5].map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold transition-all ${
                  page === p
                    ? "bg-primary-container text-white"
                    : "hover:bg-surface-container-high text-on-surface"
                }`}
              >
                {p}
              </button>
            ))}
            <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors text-on-surface-variant">
              <span className="material-symbols-outlined text-xl">chevron_right</span>
            </button>
          </div>

        </div>
      </div>
    </PageLayout>
  );
}
