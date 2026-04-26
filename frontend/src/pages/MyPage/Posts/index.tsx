import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMyPosts } from "@/api/hooks/useMyPosts";
import { MY_POSTS_PER_PAGE } from "@/api/posts";
import Pagination from "@components/common/Pagination";
import { ChatBubbleIcon, FavoriteIcon } from "@assets/icons";
import { BOARD_PATHS } from "@/routes/paths";

type BoardFilter = "all" | "free" | "promo";

const FILTERS: { label: string; value: BoardFilter }[] = [
  { label: "전체", value: "all" },
  { label: "자유게시판", value: "free" },
  { label: "홍보게시판", value: "promo" },
];

function formatDate(iso: string): string {
  const d = new Date(iso);
  const yy = String(d.getFullYear()).slice(2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${yy}.${mm}.${dd} ${hh}:${min}`;
}

export default function MyPosts() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<BoardFilter>("all");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useMyPosts(filter, page);
  const posts = data?.posts ?? [];
  const totalPages = Math.ceil((data?.totalCount ?? 0) / MY_POSTS_PER_PAGE);

  const handleFilterChange = (value: BoardFilter) => {
    setFilter(value);
    setPage(1);
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-card overflow-hidden">
      {/* 헤더 + 필터 */}
      <div className="px-6 py-4 border-b border-surface-container flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => handleFilterChange(f.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === f.value
                  ? "bg-primary-container text-white"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        {data && (
          <span className="text-xs font-semibold text-primary-container">
            {data.totalCount}개
          </span>
        )}
      </div>

      {/* 로딩 */}
      {isLoading && (
        <div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="px-6 py-4 border-b border-surface-container animate-pulse flex items-center gap-4">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-surface-container rounded w-3/4" />
                <div className="h-3 bg-surface-container rounded w-1/4" />
              </div>
              <div className="h-3 bg-surface-container rounded w-16 shrink-0" />
            </div>
          ))}
        </div>
      )}

      {/* 에러 */}
      {isError && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant/40">error</span>
          <p className="text-sm font-semibold text-on-surface-variant">불러오지 못했습니다</p>
        </div>
      )}

      {/* 빈 상태 */}
      {!isLoading && !isError && posts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant/40">article</span>
          <p className="text-sm font-semibold text-on-surface-variant">작성한 글이 없습니다</p>
          <p className="text-xs text-on-surface-variant/70">게시판에 글을 작성해보세요</p>
        </div>
      )}

      {/* 목록 */}
      {!isLoading && posts.length > 0 && (
        <div className="divide-y divide-surface-container">
          {posts.map((post) => {
            const boardType = post.board_type === "promo" ? "promo" : "free";
            const boardLabel = post.board_type === "promo" ? "홍보게시판" : "자유게시판";
            const commentCount = post.comments?.[0]?.count ?? 0;
            const likeCount = post.post_likes?.[0]?.count ?? 0;

            return (
              <button
                key={post.id}
                onClick={() => navigate(BOARD_PATHS.post(boardType, post.id))}
                className="w-full px-6 py-3.5 flex items-center gap-3 hover:bg-surface-container-low transition-colors text-left group"
              >
                {/* 왼쪽: 게시판 배지 + 제목 */}
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-fixed text-primary-container shrink-0">
                  {boardLabel}
                </span>
                {/* 제목 */}
                <p className="flex-1 min-w-0 text-sm font-semibold text-on-surface group-hover:text-primary-container transition-colors truncate">
                  {post.title}
                </p>

                {/* 오른쪽: 좋아요 · 댓글 · 날짜 */}
                <div className="flex items-center gap-3 shrink-0 text-xs text-on-surface-variant">
                  {likeCount > 0 && (
                    <span className="flex items-center gap-0.5">
                      <FavoriteIcon className="w-3.5 h-3.5" />
                      {likeCount}
                    </span>
                  )}
                  {commentCount > 0 && (
                    <span className="flex items-center gap-0.5">
                      <ChatBubbleIcon className="w-3.5 h-3.5" />
                      {commentCount}
                    </span>
                  )}
                  <span>{formatDate(post.created_at)}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* 페이지네이션 */}
      {!isLoading && totalPages >= 1 && (
        <div className="px-6 py-4 border-t border-surface-container flex justify-center">
          <Pagination page={page} totalPages={totalPages} onChange={(p) => setPage(p)} />
        </div>
      )}
    </div>
  );
}
