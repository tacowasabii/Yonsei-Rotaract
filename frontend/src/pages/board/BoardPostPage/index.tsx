import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import PageLayout from "@components/layout/PageLayout";
import { usePost } from "@/api/hooks/usePost";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
}

export default function BoardPostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isPromo = location.pathname.includes("/promo/");
  const boardType = isPromo ? "promo" : "free";
  const boardLabel = isPromo ? "홍보게시판" : "자유게시판";

  const { data: post, isLoading, isError } = usePost(id);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentText, setCommentText] = useState("");

  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  return (
    <PageLayout>
      <div className="flex items-center gap-2 mb-6 text-sm text-on-surface-variant">
        <button
          onClick={() => navigate(`/board/${boardType}`)}
          className="flex items-center gap-1 hover:text-primary-container transition-colors font-semibold"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          {boardLabel}
        </button>
      </div>

      {/* 로딩 */}
      {isLoading && (
        <div className="bg-white rounded-2xl shadow-card p-8 animate-pulse space-y-4">
          <div className="h-6 bg-surface-container rounded w-3/4" />
          <div className="h-4 bg-surface-container rounded w-1/4" />
          <div className="space-y-2 pt-4">
            <div className="h-4 bg-surface-container rounded" />
            <div className="h-4 bg-surface-container rounded" />
            <div className="h-4 bg-surface-container rounded w-2/3" />
          </div>
        </div>
      )}

      {/* 에러 */}
      {isError && (
        <div className="bg-white rounded-2xl shadow-card p-12 text-center text-on-surface-variant">
          게시글을 불러오지 못했습니다.
        </div>
      )}

      {/* 게시글 */}
      {post && (
        <div>
          <div className="bg-white rounded-2xl shadow-card overflow-hidden mb-4">
            {/* Header */}
            <div className="px-8 pt-8 pb-6 border-b border-surface-container">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary-fixed text-primary-container">
                  {boardLabel}
                </span>
                <span className="text-xs text-on-surface-variant">#{post.post_number}</span>
              </div>
              <h1 className="text-2xl font-black text-on-surface font-headline leading-snug mb-4">
                {post.title}
              </h1>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm text-primary-container">person</span>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-on-surface">{post.profiles?.name ?? "알 수 없음"}</span>
                    <p className="text-xs text-on-surface-variant">{formatDate(post.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-on-surface-variant">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">visibility</span>
                    {post.views}
                  </span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="px-8 py-8">
              <p className="text-on-surface leading-relaxed whitespace-pre-line text-[15px]">
                {post.content}
              </p>

              {/* 첨부 이미지 */}
              {post.image_urls && post.image_urls.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {post.image_urls.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt=""
                      className="max-w-sm w-full rounded-xl object-cover"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="px-8 pb-6 flex items-center justify-between">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                  liked
                    ? "bg-tertiary-container/20 text-tertiary-container"
                    : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                <span
                  className="material-symbols-outlined text-lg"
                  style={{ fontVariationSettings: liked ? '"FILL" 1' : '"FILL" 0' }}
                >
                  favorite
                </span>
                {likeCount}
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm text-on-surface-variant hover:bg-surface-container transition-all">
                <span className="material-symbols-outlined text-lg">share</span>
                공유
              </button>
            </div>
          </div>

          {/* 댓글 */}
          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            <div className="px-8 py-5 border-b border-surface-container">
              <h2 className="font-bold text-on-surface">댓글</h2>
            </div>

            <div className="px-8 py-5 bg-surface-container-low">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-sm text-primary-container">person</span>
                </div>
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="댓글을 입력하세요..."
                    className="flex-1 px-4 py-2.5 bg-white rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-container/30 transition-all placeholder:text-on-surface-variant shadow-card"
                  />
                  <button
                    disabled={!commentText.trim()}
                    className="px-4 py-2.5 bg-primary-container text-white font-bold rounded-xl text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    등록
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
