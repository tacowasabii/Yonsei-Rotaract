import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageLayout from "@components/layout/PageLayout";
import PageHeader from "@components/layout/PageHeader";
import { ForumIcon, ChatBubbleIcon } from "@assets/icons";
import { usePosts } from "@/api/hooks/usePosts";
import { POSTS_PER_PAGE } from "@/api/posts";
import { useIsLoggedIn } from "@/contexts/AuthContext";
import Pagination from "@components/common/Pagination";

const noticePosts = [
  { id: "notice", title: "[필독] 2025년도 2학기 동아리 활동 가이드라인 안내", author: "관리자", date: "25.01.10", pinned: true },
  { id: "notice2", title: "3월 정기 모임 참가 신청 안내 (선착순 30명)", author: "운영위원회", date: "25.01.08", pinned: false },
];

function formatDate(iso: string): string {
  const d = new Date(iso);
  const yy = String(d.getFullYear()).slice(2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yy}.${mm}.${dd}`;
}

export default function BoardPage() {
  const location = useLocation();
  const isPromo = location.pathname === "/board/promo";
  const boardType = isPromo ? "promo" : "free";
  const boardLabel = isPromo ? "홍보게시판" : "자유게시판";
  const boardDesc = isPromo
    ? "모집·홍보·나눔 등 공유하고 싶은 소식을 올려보세요."
    : "회원들과 자유롭게 소통하는 공간입니다.";

  const navigate = useNavigate();
  const isLoggedIn = useIsLoggedIn();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = usePosts(boardType, page);
  const posts = data?.posts ?? [];
  const totalPages = Math.ceil((data?.totalCount ?? 0) / POSTS_PER_PAGE);

  const filtered = posts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageLayout>
      <PageHeader iconNode={<ForumIcon />} title={boardLabel} subtitle={boardDesc} />

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
        {isLoggedIn && (
          <button
            onClick={() => navigate(`/board/${boardType}/write`)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-container text-white font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all text-sm shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
            글쓰기
          </button>
        )}
      </div>

      <div className="bg-surface-container-low rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed border-separate border-spacing-y-0.5">
            <thead>
              <tr className="bg-surface-container text-on-surface-variant text-sm font-semibold">
                <th className="py-4 px-4 text-center w-16">번호</th>
                <th className="py-4 px-4 text-left w-1/2">제목</th>
                <th className="py-4 px-4 text-center w-24 hidden sm:table-cell">글쓴이</th>
                <th className="py-4 px-4 text-center w-24 hidden md:table-cell">날짜</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {/* 공지 */}
              {noticePosts.map((post) => (
                <tr key={post.id} className="bg-secondary-fixed/30 hover:bg-secondary-fixed/50 transition-colors cursor-pointer">
                  <td className="py-4 px-4 text-center">
                    <span className="bg-primary-container text-white px-2 py-0.5 rounded text-[10px] font-bold">공지</span>
                  </td>
                  <td className="py-4 px-4 font-bold text-primary-container max-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="truncate">{post.title}</span>
                      {post.pinned && (
                        <span className="material-symbols-outlined text-sm shrink-0" style={{ fontVariationSettings: '"FILL" 1' }}>
                          push_pin
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center text-on-surface-variant hidden sm:table-cell">{post.author}</td>
                  <td className="py-4 px-4 text-center text-on-surface-variant hidden md:table-cell">{post.date}</td>
                </tr>
              ))}

              <tr><td colSpan={4} className="h-px bg-outline-variant/20 p-0" /></tr>

              {/* 로딩 */}
              {isLoading && (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="bg-white animate-pulse">
                    <td className="py-4 px-4"><div className="h-4 bg-surface-container rounded mx-auto w-8" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-surface-container rounded w-3/4" /></td>
                    <td className="py-4 px-4 hidden sm:table-cell"><div className="h-4 bg-surface-container rounded mx-auto w-16" /></td>
                    <td className="py-4 px-4 hidden md:table-cell"><div className="h-4 bg-surface-container rounded mx-auto w-16" /></td>
                  </tr>
                ))
              )}

              {/* 에러 */}
              {isError && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-on-surface-variant text-sm">
                    게시글을 불러오지 못했습니다.
                  </td>
                </tr>
              )}

              {/* 데이터 없음 */}
              {!isLoading && !isError && filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-on-surface-variant text-sm">
                    {search ? "검색 결과가 없습니다." : "아직 게시글이 없습니다."}
                  </td>
                </tr>
              )}

              {/* 게시글 목록 */}
              {!isLoading && filtered.map((post) => {
                const commentCount = post.comments?.[0]?.count ?? 0;
                return (
                  <tr
                    key={post.id}
                    onClick={() => navigate(`/board/${boardType}/${post.id}`)}
                    className="hover:bg-surface-container-lowest transition-colors cursor-pointer group bg-white"
                  >
                    <td className="py-4 px-4 text-center text-on-surface-variant">{post.post_number}</td>
                    <td className="py-4 px-4 text-on-surface group-hover:text-primary-container transition-colors font-medium max-w-0">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="truncate">{post.title}</span>
                        {commentCount > 0 && (
                          <span className="flex items-center gap-0.5 text-primary-container shrink-0">
                            <ChatBubbleIcon className="w-4 h-4" />
                            <span className="text-xs font-semibold">{commentCount}</span>
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center hidden sm:table-cell">
                      <span className="text-on-surface-variant">{post.profiles?.name ?? "—"}</span>
                    </td>
                    <td className="py-4 px-4 text-center text-on-surface-variant hidden md:table-cell">
                      {formatDate(post.created_at)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-5 bg-surface-container-low flex justify-center">
          <Pagination page={page} totalPages={totalPages} onChange={(p) => { setPage(p); setSearch(""); }} />
        </div>
      </div>
    </PageLayout>
  );
}
