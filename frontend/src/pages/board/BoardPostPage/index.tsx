import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageLayout from "@components/layout/PageLayout";
import { usePost } from "@/api/hooks/posts/usePost";
import { useAnonPost } from "@/api/hooks/posts/useAnonPost";
import { useDeletePost } from "@/api/hooks/posts/useDeletePost";
import { useComments } from "@/api/hooks/comments/useComments";
import { useAnonComments } from "@/api/hooks/comments/useAnonComments";
import { useCreateComment } from "@/api/hooks/comments/useCreateComment";
import { useUpdateComment } from "@/api/hooks/comments/useUpdateComment";
import { useDeleteComment } from "@/api/hooks/comments/useDeleteComment";
import { useAuth } from "@/contexts/AuthContext";
import { PATHS, BOARD_PATHS } from "@/routes/paths";
import { useTogglePin } from "@/api/hooks/posts/useTogglePin";
import { usePostLike } from "@/api/hooks/posts/usePostLike";
import DeleteConfirmModal from "@components/common/DeleteConfirmModal";
import { ChatBubbleIcon, FavoriteIcon, FavoriteFillIcon, ArrowBackIcon, LockIcon, ShareIcon } from "@assets/icons";
import { useBoardType } from "@/hooks/useBoardType";
import PostHeader from "./components/PostHeader";
import CommentList from "./components/CommentList";
import CommentInput from "./components/CommentInput";

export default function BoardPostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { boardType, boardLabel, isAnon, isNoticeBoard } = useBoardType();

  const { user } = useAuth();
  const { mutate: togglePin } = useTogglePin(id ?? "");

  const { data: post, isLoading: isPostLoading, isError: isPostError } =
    usePost(isAnon ? undefined : id);
  const { data: anonPost, isLoading: isAnonLoading, isError: isAnonError } =
    useAnonPost(isAnon ? id : undefined);
  const { data: comments = [], isLoading: isCommentsLoading } =
    useComments(isAnon ? undefined : id);
  const { data: anonComments = [], isLoading: isAnonCommentsLoading } =
    useAnonComments(isAnon ? id : undefined);

  const isLoading = isAnon ? isAnonLoading : isPostLoading;
  const isError   = isAnon ? isAnonError : isPostError;
  const resolvedPost     = isAnon ? anonPost : post;
  const resolvedComments = isAnon ? anonComments : comments;
  const resolvedCommentsLoading = isAnon ? isAnonCommentsLoading : isCommentsLoading;

  const { mutate: deletePost, isPending: isDeleting } = useDeletePost(boardType);
  const { mutate: createComment, isPending: isCreating } = useCreateComment(id ?? "");
  const { mutate: updateComment, isPending: isUpdating } = useUpdateComment(id ?? "");
  const { mutate: deleteComment } = useDeleteComment(id ?? "");

  const { liked, toggle: toggleLike } = usePostLike(id);
  const likeCount = isAnon
    ? (anonPost?.like_count ?? 0)
    : (post?.post_likes?.[0]?.count ?? 0);

  const [commentText, setCommentText]     = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingId, setEditingId]         = useState<string | null>(null);
  const [editText, setEditText]           = useState("");
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const [replyingToId, setReplyingToId]   = useState<string | null>(null);
  const [replyText, setReplyText]         = useState("");

  const isAuthor = isAnon
    ? (anonPost?.is_mine ?? false)
    : !!user && !!post && user.id === post.author_id;

  function handleCreateComment() {
    const trimmed = commentText.trim();
    if (!trimmed) return;
    createComment({ content: trimmed }, { onSuccess: () => setCommentText("") });
  }

  function handleReplySubmit() {
    const trimmed = replyText.trim();
    if (!trimmed || !replyingToId) return;
    createComment(
      { content: trimmed, parentId: replyingToId },
      { onSuccess: () => { setReplyText(""); setReplyingToId(null); } },
    );
  }

  function handleEditStart(commentId: string, content: string) {
    setEditingId(commentId);
    setEditText(content);
  }

  function handleEditSave() {
    if (!editingId || !editText.trim()) return;
    updateComment(
      { id: editingId, content: editText.trim() },
      { onSuccess: () => setEditingId(null) },
    );
  }

  function handleEditCancel() {
    setEditingId(null);
  }

  function handleDeletePost() {
    if (!id) return;
    deletePost(id, {
      onSuccess: () =>
        navigate(isNoticeBoard ? PATHS.NOTICE : BOARD_PATHS.root(boardType)),
    });
  }

  function handleLikeClick() {
    if (!user) {
      navigate(PATHS.LOGIN);
      return;
    }
    toggleLike();
  }

  function handleDeleteComment() {
    if (!deletingCommentId) return;
    deleteComment(deletingCommentId, {
      onSuccess: () => setDeletingCommentId(null),
    });
  }

  return (
    <PageLayout>
      <div className="flex items-center gap-2 mb-6 text-sm text-on-surface-variant">
        <button
          onClick={() =>
            navigate(isNoticeBoard ? PATHS.NOTICE : BOARD_PATHS.root(boardType))
          }
          className="flex items-center gap-1 hover:text-primary-container transition-colors font-semibold"
        >
          <ArrowBackIcon className="w-4.5 h-4.5" />
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

      {resolvedPost && !user && resolvedPost.visibility === "members" && (
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="px-8 pt-8 pb-6 border-b border-surface-container">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary-fixed text-primary-container">
                {boardLabel}
              </span>
              <span className="text-xs text-on-surface-variant">
                #{resolvedPost.post_number}
              </span>
            </div>
            <h1 className="text-2xl font-black text-on-surface font-headline leading-snug mb-1">
              {resolvedPost.title}
            </h1>
            <p className="text-sm text-on-surface-variant">
              {resolvedPost.created_at}
            </p>
          </div>
          <div className="px-8 py-16 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center">
              <LockIcon className="w-8 h-8 text-on-surface-variant" />
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

      {resolvedPost && (user || resolvedPost.visibility === "public") && (
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <PostHeader
            post={resolvedPost}
            boardType={boardType}
            boardLabel={boardLabel}
            isAnon={isAnon}
            isNoticeBoard={isNoticeBoard}
            isAuthor={isAuthor}
            onDeleteClick={() => setShowDeleteConfirm(true)}
            onTogglePin={(isPinned) => togglePin(isPinned)}
          />

          {/* 본문 */}
          <div className="px-4 md:px-8 py-6 md:py-8 min-h-37.5">
            <p className="text-on-surface leading-relaxed whitespace-pre-line text-[15px]">
              {resolvedPost.content}
            </p>
            {resolvedPost.image_urls && resolvedPost.image_urls.length > 0 && (
              <div className="mt-6 flex flex-col gap-3">
                {resolvedPost.image_urls.map((url, i) => (
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

          {/* 액션 바 */}
          <div className="px-4 md:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <button
                onClick={handleLikeClick}
                className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                  liked ? "text-red-500" : "text-on-surface-variant hover:text-on-surface"
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
                댓글 {resolvedComments.length}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-on-surface-variant">
              <button className="hover:text-on-surface transition-colors flex items-center gap-1">
                <ShareIcon className="w-4 h-4" />
                공유
              </button>
              <span className="text-outline-variant">|</span>
              <button className="hover:text-on-surface transition-colors">신고</button>
            </div>
          </div>

          <CommentList
            comments={resolvedComments}
            isLoading={resolvedCommentsLoading}
            userId={user?.id}
            isPostAuthor={isAuthor}
            editingId={editingId}
            editText={editText}
            isUpdating={isUpdating}
            onEditStart={handleEditStart}
            onEditSave={handleEditSave}
            onEditCancel={handleEditCancel}
            onEditTextChange={setEditText}
            onDeleteClick={setDeletingCommentId}
            replyingToId={replyingToId}
            replyText={replyText}
            isCreatingReply={isCreating}
            onReplyStart={setReplyingToId}
            onReplyCancel={() => { setReplyingToId(null); setReplyText(""); }}
            onReplyTextChange={setReplyText}
            onReplySubmit={handleReplySubmit}
          />

          <CommentInput
            isLoggedIn={!!user}
            commentText={commentText}
            isCreating={isCreating}
            onTextChange={setCommentText}
            onSubmit={handleCreateComment}
          />
        </div>
      )}

      {showDeleteConfirm && (
        <DeleteConfirmModal
          title="게시글 삭제"
          description="이 게시글을 삭제하시겠어요? 되돌릴 수 없습니다."
          isPending={isDeleting}
          onConfirm={handleDeletePost}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}

      {deletingCommentId && (
        <DeleteConfirmModal
          title="댓글 삭제"
          description="이 댓글을 삭제하시겠어요? 되돌릴 수 없습니다."
          onConfirm={handleDeleteComment}
          onCancel={() => setDeletingCommentId(null)}
        />
      )}
    </PageLayout>
  );
}
