import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import PageLayout from "@components/layout/PageLayout";
import { usePost } from "@/api/hooks/posts/usePost";
import { useDeletePost } from "@/api/hooks/posts/useDeletePost";
import { useComments } from "@/api/hooks/comments/useComments";
import { useCreateComment } from "@/api/hooks/comments/useCreateComment";
import { useUpdateComment } from "@/api/hooks/comments/useUpdateComment";
import { useDeleteComment } from "@/api/hooks/comments/useDeleteComment";
import { useAuth } from "@/contexts/AuthContext";
import { PATHS, BOARD_PATHS } from "@/routes/paths";
import { usePostLike } from "@/api/hooks/posts/usePostLike";
import DeleteConfirmModal from "@components/common/DeleteConfirmModal";
import { ChatBubbleIcon, FavoriteIcon, FavoriteFillIcon, PersonIcon } from "@assets/icons";

function formatDate(iso: string): string {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
}

export default function BoardPostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isPromo = location.pathname.includes("/promo/");
  const boardType = isPromo ? "promo" : "free";
  const boardLabel = isPromo ? "홍보게시판" : "자유게시판";

  const { user } = useAuth();
  const { data: post, isLoading, isError } = usePost(id);
  const { mutate: deletePost, isPending: isDeleting } =
    useDeletePost(boardType);
  const { data: comments = [], isLoading: isCommentsLoading } = useComments(id);
  const { mutate: createComment, isPending: isCreating } = useCreateComment(
    id ?? "",
  );
  const { mutate: updateComment, isPending: isUpdating } = useUpdateComment(
    id ?? "",
  );
  const { mutate: deleteComment } = useDeleteComment(id ?? "");

  const { liked, toggle: toggleLike } = usePostLike(id);
  const likeCount = post?.post_likes?.[0]?.count ?? 0;
  const [commentText, setCommentText] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(
    null,
  );

  const isAuthor = !!user && !!post && user.id === post.author_id;

  const handleCreateComment = () => {
    const trimmed = commentText.trim();
    if (!trimmed) return;
    createComment(trimmed, { onSuccess: () => setCommentText("") });
  };

  const handleStartEdit = (commentId: string, content: string) => {
    setEditingId(commentId);
    setEditText(content);
  };

  const handleSaveEdit = () => {
    if (!editingId || !editText.trim()) return;
    updateComment(
      { id: editingId, content: editText.trim() },
      { onSuccess: () => setEditingId(null) },
    );
  };

  const handleDelete = () => {
    if (!id) return;
    deletePost(id, {
      onSuccess: () => navigate(BOARD_PATHS.root(boardType)),
    });
  };

  return (
    <PageLayout>
      <div className="flex items-center gap-2 mb-6 text-sm text-on-surface-variant">
        <button
          onClick={() => navigate(BOARD_PATHS.root(boardType))}
          className="flex items-center gap-1 hover:text-primary-container transition-colors font-semibold"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          {boardLabel}
        </button>
      </div>

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

      {isError && (
        <div className="bg-white rounded-2xl shadow-card p-12 text-center text-on-surface-variant">
          게시글을 불러오지 못했습니다.
        </div>
      )}

      {post && !user && post.visibility === "members" && (
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="px-8 pt-8 pb-6 border-b border-surface-container">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary-fixed text-primary-container">
                {boardLabel}
              </span>
              {post.is_notice && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary-container text-white">
                  공지
                </span>
              )}
              <span className="text-xs text-on-surface-variant">
                #{post.post_number}
              </span>
            </div>
            <h1 className="text-2xl font-black text-on-surface font-headline leading-snug mb-1">
              {post.title}
            </h1>
            <p className="text-sm text-on-surface-variant">
              {formatDate(post.created_at)}
            </p>
          </div>
          <div className="px-8 py-16 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center">
              <span
                className="material-symbols-outlined text-3xl text-on-surface-variant"
                style={{ fontVariationSettings: '"FILL" 1' }}
              >
                lock
              </span>
            </div>
            <div>
              <p className="font-bold text-on-surface text-lg mb-1">
                회원 전용 게시글입니다
              </p>
              <p className="text-sm text-on-surface-variant">
                로그인 후 내용을 확인할 수 있습니다.
              </p>
            </div>
            <button
              onClick={() => navigate(PATHS.LOGIN)}
              className="mt-2 px-6 py-2.5 bg-primary-container text-white font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all text-sm"
            >
              로그인하기
            </button>
          </div>
        </div>
      )}

      {post && (user || post.visibility === "public") && (
        <div>
          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            {/* Header */}
            <div className="px-8 pt-8 pb-6 border-b border-surface-container">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary-fixed text-primary-container">
                  {boardLabel}
                </span>
                {post.is_notice && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary-container text-white">
                    공지
                  </span>
                )}
                <span className="text-xs text-on-surface-variant">
                  #{post.post_number}
                </span>
              </div>
              <h1 className="text-2xl font-black text-on-surface font-headline leading-snug mb-4">
                {post.title}
              </h1>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center">
                    <PersonIcon className="w-4 h-4 text-primary-container" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-on-surface">
                      {post.profiles?.name ?? "알 수 없음"}
                    </span>
                    <p className="text-xs text-on-surface-variant">
                      {formatDate(post.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* 수정/삭제 버튼 (작성자만) */}
                  {isAuthor && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          id && navigate(BOARD_PATHS.edit(boardType, id))
                        }
                        className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-all"
                      >
                        <span className="material-symbols-outlined text-sm">
                          edit
                        </span>
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-all"
                      >
                        <span className="material-symbols-outlined text-sm">
                          delete
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="px-8 py-8 min-h-37.5">
              <p className="text-on-surface leading-relaxed whitespace-pre-line text-[15px]">
                {post.content}
              </p>

              {post.image_urls && post.image_urls.length > 0 && (
                <div className="mt-6 flex flex-col gap-3">
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
            <div className="px-8 py-4 flex items-center justify-between">
              <div className="flex items-center gap-5">
                <button
                  onClick={() => {
                    if (!user) { navigate(PATHS.LOGIN); return; }
                    toggleLike();
                  }}
                  className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                    liked
                      ? "text-red-500"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  {liked ? (
                    <FavoriteFillIcon className="w-5 h-5" />
                  ) : (
                    <FavoriteIcon className="w-5 h-5" />
                  )}
                  좋아요 {likeCount}
                </button>
                <span className="flex items-center gap-1.5 text-sm text-on-surface-variant">
                  <ChatBubbleIcon className="w-4.5 h-4.5" />
                  댓글 {comments.length}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                <button className="hover:text-on-surface transition-colors flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">
                    share
                  </span>
                  공유
                </button>
                <span className="text-outline-variant">|</span>
                <button className="hover:text-on-surface transition-colors">
                  신고
                </button>
              </div>
            </div>

            {/* 댓글 목록 */}
            <div className="divide-y divide-surface-container">
              {isCommentsLoading &&
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="px-8 py-4 animate-pulse flex gap-3">
                    <div className="w-9 h-9 rounded-full bg-surface-container shrink-0" />
                    <div className="flex-1 space-y-2 pt-1">
                      <div className="h-3 bg-surface-container rounded w-20" />
                      <div className="h-4 bg-surface-container rounded w-3/4" />
                      <div className="h-3 bg-surface-container rounded w-24" />
                    </div>
                  </div>
                ))}

              {!isCommentsLoading && comments.length === 0 && (
                <div className="px-8 py-10 text-center text-sm text-on-surface-variant">
                  아직 댓글이 없습니다.
                </div>
              )}

              {!isCommentsLoading &&
                comments.map((comment) => {
                    const isCommentAuthor =
                      !!user && user.id === comment.author_id;
                    const canDelete = isCommentAuthor || isAuthor;
                    const isEditingThis = editingId === comment.id;

                    return (
                      <div
                        key={comment.id}
                        className="px-8 py-4 flex items-start gap-3"
                      >
                        <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center shrink-0 mt-0.5">
                          <PersonIcon className="w-4 h-4 text-on-surface-variant" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-bold text-on-surface">
                              {comment.profiles?.name ?? "알 수 없음"}
                            </span>
                            <div className="flex items-center gap-0.5 shrink-0">
                              {isCommentAuthor && (
                                <button
                                  onClick={() =>
                                    handleStartEdit(comment.id, comment.content)
                                  }
                                  className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container transition-all"
                                >
                                  <span className="material-symbols-outlined text-sm">
                                    edit
                                  </span>
                                </button>
                              )}
                              {canDelete && (
                                <button
                                  onClick={() =>
                                    setDeletingCommentId(comment.id)
                                  }
                                  className="p-1 rounded-lg text-red-400 hover:bg-red-50 transition-all"
                                >
                                  <span className="material-symbols-outlined text-sm">
                                    delete
                                  </span>
                                </button>
                              )}
                            </div>
                          </div>

                          {isEditingThis ? (
                            <div className="flex gap-2 mt-2">
                              <input
                                type="text"
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleSaveEdit();
                                  if (e.key === "Escape") setEditingId(null);
                                }}
                                className="flex-1 px-3 py-2 bg-surface-container-low rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-container/30 transition-all"
                                autoFocus
                              />
                              <button
                                onClick={handleSaveEdit}
                                disabled={!editText.trim() || isUpdating}
                                className="px-3 py-2 bg-primary-container text-white font-bold rounded-xl text-xs hover:opacity-90 transition-all disabled:opacity-40"
                              >
                                저장
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="px-3 py-2 bg-surface-container text-on-surface-variant font-semibold rounded-xl text-xs hover:bg-surface-container-high transition-all"
                              >
                                취소
                              </button>
                            </div>
                          ) : (
                            <p className="text-sm text-on-surface leading-relaxed mt-0.5">
                              {comment.content}
                            </p>
                          )}
                          <p className="text-xs text-on-surface-variant mt-1">
                            {formatDate(comment.created_at)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
            </div>

            {/* 댓글 입력 */}
            <div className="px-8 py-5 bg-surface-container-low border-t border-surface-container">
              {user ? (
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                    <PersonIcon className="w-4 h-4 text-on-surface-variant" />
                  </div>
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleCreateComment();
                      }}
                      placeholder="댓글을 입력하세요..."
                      className="flex-1 px-4 py-2.5 bg-white rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-container/30 transition-all placeholder:text-on-surface-variant shadow-card"
                    />
                    <button
                      onClick={handleCreateComment}
                      disabled={!commentText.trim() || isCreating}
                      className="px-4 py-2.5 bg-primary-container text-white font-bold rounded-xl text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isCreating ? "등록 중..." : "등록"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm text-on-surface-variant">
                    댓글을 작성하려면 로그인이 필요합니다.
                  </p>
                  <button
                    onClick={() => navigate(PATHS.LOGIN)}
                    className="px-4 py-2 bg-primary-container text-white font-bold rounded-xl text-sm hover:opacity-90 transition-all shrink-0"
                  >
                    로그인하기
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {showDeleteConfirm && (
        <DeleteConfirmModal
          title="게시글 삭제"
          description="이 게시글을 삭제하시겠어요? 되돌릴 수 없습니다."
          isPending={isDeleting}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}

      {deletingCommentId && (
        <DeleteConfirmModal
          title="댓글 삭제"
          description="이 댓글을 삭제하시겠어요? 되돌릴 수 없습니다."
          onConfirm={() =>
            deleteComment(deletingCommentId, {
              onSuccess: () => setDeletingCommentId(null),
            })
          }
          onCancel={() => setDeletingCommentId(null)}
        />
      )}
    </PageLayout>
  );
}
