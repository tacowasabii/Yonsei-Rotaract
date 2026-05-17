import { formatDateTime } from "@/utils/date";
import { EditIcon, DeleteIcon, PersonIcon } from "@assets/icons";
import type { Comment, AnonComment } from "@/api/comments";
import { isAnonComment } from "@/utils/commentTypeGuards";

interface Props {
  comments: Array<Comment | AnonComment>;
  isLoading: boolean;
  userId: string | undefined;
  isPostAuthor: boolean;
  editingId: string | null;
  editText: string;
  isUpdating: boolean;
  onEditStart: (id: string, content: string) => void;
  onEditSave: () => void;
  onEditCancel: () => void;
  onEditTextChange: (text: string) => void;
  onDeleteClick: (id: string) => void;
  replyingToId: string | null;
  replyText: string;
  isCreatingReply: boolean;
  onReplyStart: (id: string) => void;
  onReplyCancel: () => void;
  onReplyTextChange: (text: string) => void;
  onReplySubmit: () => void;
}

function CommentItem({
  comment,
  userId,
  isPostAuthor,
  editingId,
  editText,
  isUpdating,
  onEditStart,
  onEditSave,
  onEditCancel,
  onEditTextChange,
  onDeleteClick,
  showReplyButton,
  isReplying,
  onReplyToggle,
}: {
  comment: Comment | AnonComment;
  userId: string | undefined;
  isPostAuthor: boolean;
  editingId: string | null;
  editText: string;
  isUpdating: boolean;
  onEditStart: (id: string, content: string) => void;
  onEditSave: () => void;
  onEditCancel: () => void;
  onEditTextChange: (text: string) => void;
  onDeleteClick: (id: string) => void;
  showReplyButton?: boolean;
  isReplying?: boolean;
  onReplyToggle?: () => void;
}) {
  const isAnon = isAnonComment(comment);
  const isCommentAuthor = isAnon ? comment.is_mine : !!userId && userId === comment.author_id;
  const canDelete = isAnon ? comment.can_delete : isCommentAuthor || isPostAuthor;
  const displayName = isAnon ? comment.anon_label : ((comment as Comment).profiles?.name ?? "알 수 없음");
  const isEditingThis = editingId === comment.id;

  if (comment.is_deleted) {
    return (
      <div className="flex items-center gap-3 py-3">
        <div className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center shrink-0">
          <PersonIcon className="w-3.5 h-3.5 text-outline-variant" />
        </div>
        <p className="text-sm text-outline-variant italic">삭제된 댓글입니다.</p>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      {!isAnon && (comment as Comment).profiles?.avatar_url ? (
        <img
          src={(comment as Comment).profiles!.avatar_url!}
          alt={(comment as Comment).profiles?.name}
          className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5"
        />
      ) : (
        <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center shrink-0 mt-0.5">
          <PersonIcon className="w-4 h-4 text-on-surface-variant" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-bold text-on-surface">{displayName}</span>
          <div className="flex items-center gap-0.5 shrink-0">
            {isCommentAuthor && (
              <button
                onClick={() => onEditStart(comment.id, comment.content)}
                className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container transition-all"
                aria-label="댓글 수정"
              >
                <EditIcon className="w-4 h-4" />
              </button>
            )}
            {canDelete && (
              <button
                onClick={() => onDeleteClick(comment.id)}
                className="p-1 rounded-lg text-red-400 hover:bg-red-50 transition-all"
                aria-label="댓글 삭제"
              >
                <DeleteIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {isEditingThis ? (
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={editText}
              onChange={(e) => onEditTextChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.nativeEvent.isComposing) onEditSave();
                if (e.key === "Escape") onEditCancel();
              }}
              className="flex-1 px-3 py-2 bg-surface-container-low rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-container/30 transition-all"
              autoFocus
            />
            <button
              onClick={onEditSave}
              disabled={!editText.trim() || isUpdating}
              className="px-3 py-2 bg-primary-container text-white font-bold rounded-xl text-xs hover:opacity-90 transition-all disabled:opacity-40"
            >
              저장
            </button>
            <button
              onClick={onEditCancel}
              className="px-3 py-2 bg-surface-container text-on-surface-variant font-semibold rounded-xl text-xs hover:bg-surface-container-high transition-all"
            >
              취소
            </button>
          </div>
        ) : (
          <p className="text-sm text-on-surface leading-relaxed mt-0.5">{comment.content}</p>
        )}

        <div className="flex items-center gap-2 mt-1">
          <p className="text-xs text-on-surface-variant">{formatDateTime(comment.created_at)}</p>
          {showReplyButton && (
            <button
              onClick={onReplyToggle}
              className="text-xs text-on-surface-variant hover:text-primary-container transition-colors font-semibold"
            >
              {isReplying ? "취소" : "답글 달기"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CommentList({
  comments,
  isLoading,
  userId,
  isPostAuthor,
  editingId,
  editText,
  isUpdating,
  onEditStart,
  onEditSave,
  onEditCancel,
  onEditTextChange,
  onDeleteClick,
  replyingToId,
  replyText,
  isCreatingReply,
  onReplyStart,
  onReplyCancel,
  onReplyTextChange,
  onReplySubmit,
}: Props) {
  if (isLoading) {
    return (
      <div className="divide-y divide-surface-container">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="px-4 md:px-8 py-4 animate-pulse flex gap-3">
            <div className="w-9 h-9 rounded-full bg-surface-container shrink-0" />
            <div className="flex-1 space-y-2 pt-1">
              <div className="h-3 bg-surface-container rounded w-20" />
              <div className="h-4 bg-surface-container rounded w-3/4" />
              <div className="h-3 bg-surface-container rounded w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="px-4 md:px-8 py-10 text-center text-sm text-on-surface-variant">
        아직 댓글이 없습니다.
      </div>
    );
  }

  const topLevel = comments.filter((c) => c.parent_id === null);
  const repliesMap = new Map<string, Array<Comment | AnonComment>>();
  comments.forEach((c) => {
    if (c.parent_id) {
      const existing = repliesMap.get(c.parent_id) ?? [];
      repliesMap.set(c.parent_id, [...existing, c]);
    }
  });

  const sharedItemProps = {
    userId,
    isPostAuthor,
    editingId,
    editText,
    isUpdating,
    onEditStart,
    onEditSave,
    onEditCancel,
    onEditTextChange,
    onDeleteClick,
  };

  return (
    <div className="divide-y divide-surface-container">
      {topLevel.map((comment) => {
        const replies = repliesMap.get(comment.id) ?? [];
        const isReplying = replyingToId === comment.id;

        return (
          <div key={comment.id} className="px-4 md:px-8 py-4">
            <CommentItem
              comment={comment}
              {...sharedItemProps}
              showReplyButton={!comment.is_deleted && !!userId}
              isReplying={isReplying}
              onReplyToggle={isReplying ? onReplyCancel : () => onReplyStart(comment.id)}
            />

            {/* 기존 답글 목록 */}
            {replies.length > 0 && (
              <div className="ml-8 md:ml-12 mt-3 space-y-3 border-l-2 border-surface-container pl-4">
                {replies.map((reply) => (
                  <CommentItem key={reply.id} comment={reply} {...sharedItemProps} />
                ))}
              </div>
            )}

            {/* 인라인 답글 입력창 */}
            {isReplying && (
              <div className="ml-8 md:ml-12 mt-3 flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => onReplyTextChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.nativeEvent.isComposing) onReplySubmit();
                    if (e.key === "Escape") onReplyCancel();
                  }}
                  placeholder="답글을 입력하세요..."
                  className="flex-1 px-4 py-2.5 bg-surface-container-low rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-container/30 transition-all placeholder:text-on-surface-variant"
                  autoFocus
                />
                <button
                  onClick={onReplySubmit}
                  disabled={!replyText.trim() || isCreatingReply}
                  className="px-4 py-2.5 bg-primary-container text-white font-bold rounded-xl text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isCreatingReply ? "등록 중..." : "등록"}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
