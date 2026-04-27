import { useState } from "react";
import { useMyPosts } from "@/api/hooks/posts/useMyPosts";
import { MY_POSTS_PER_PAGE } from "@/api/posts";
import Pagination from "@components/common/Pagination";
import PostRow from "./components/PostRow";

type BoardFilter = "all" | "free" | "promo";

const FILTERS: { label: string; value: BoardFilter }[] = [
  { label: "전체", value: "all" },
  { label: "자유게시판", value: "free" },
  { label: "홍보게시판", value: "promo" },
];

export default function MyPosts() {
  const [filter, setFilter] = useState<BoardFilter>("all");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useMyPosts(filter, page);
  const posts = data?.posts ?? [];
  const totalPages = Math.ceil((data?.totalCount ?? 0) / MY_POSTS_PER_PAGE);

  function handleFilterChange(value: BoardFilter) {
    setFilter(value);
    setPage(1);
  }

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
          {posts.map((post) => (
            <PostRow key={post.id} post={post} />
          ))}
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
