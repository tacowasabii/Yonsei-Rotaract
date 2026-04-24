import { useNavigate } from "react-router-dom";
import { useMyPosts } from "@/api/hooks/useMyPosts";

function formatDate(iso: string): string {
  const d = new Date(iso);
  const yy = String(d.getFullYear()).slice(2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yy}.${mm}.${dd}`;
}

export default function MyPosts() {
  const navigate = useNavigate();
  const { data: posts, isLoading, isError } = useMyPosts();

  if (isLoading) {
    return (
      <div className="bg-surface-container-lowest rounded-2xl shadow-card overflow-hidden">
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
    );
  }

  if (isError) {
    return (
      <div className="bg-surface-container-lowest rounded-2xl shadow-card flex flex-col items-center justify-center py-20 gap-3">
        <span className="material-symbols-outlined text-5xl text-on-surface-variant/40">error</span>
        <p className="text-sm font-semibold text-on-surface-variant">불러오지 못했습니다</p>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="bg-surface-container-lowest rounded-2xl shadow-card flex flex-col items-center justify-center py-20 gap-3">
        <span className="material-symbols-outlined text-5xl text-on-surface-variant/40">article</span>
        <p className="text-sm font-semibold text-on-surface-variant">작성한 글이 없습니다</p>
        <p className="text-xs text-on-surface-variant/70">게시판에 글을 작성해보세요</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-card overflow-hidden">
      <div className="px-6 py-4 border-b border-surface-container flex items-center justify-between">
        <span className="text-sm font-bold text-on-surface">작성한 글</span>
        <span className="text-xs font-semibold text-primary-container">{posts.length}개</span>
      </div>

      <div className="divide-y divide-surface-container">
        {posts.map((post) => {
          const boardType = post.board_type === "promo" ? "promo" : "free";
          const boardLabel = post.board_type === "promo" ? "홍보게시판" : "자유게시판";

          return (
            <button
              key={post.id}
              onClick={() => navigate(`/board/${boardType}/${post.id}`)}
              className="w-full px-6 py-4 flex items-start justify-between gap-4 hover:bg-surface-container-low transition-colors text-left group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-fixed text-primary-container shrink-0">
                    {boardLabel}
                  </span>
                  {post.image_urls && post.image_urls.length > 0 && (
                    <span className="material-symbols-outlined text-sm text-on-surface-variant/60">image</span>
                  )}
                </div>
                <p className="text-sm font-semibold text-on-surface group-hover:text-primary-container transition-colors truncate">
                  {post.title}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0 text-xs text-on-surface-variant">
                <span>{formatDate(post.created_at)}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
