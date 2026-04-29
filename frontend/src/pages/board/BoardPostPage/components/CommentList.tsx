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
}: Props) {
  if (isLoading) {
    return (
      <div className="divide-y divide-surface-container">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="px-8 py-4 animate-pulse flex gap-3">
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
      <div className="px-8 py-10 text-center text-sm text-on-surface-variant">
        아직 댓글이 없습니다.
      </div>
    );
  }

  return (
    <div className="divide-y divide-surface-container">
      {comments.map((comment) => {
        const isAnon = isAnonComment(comment);
        const isCommentAuthor = isAnon
          ? comment.is_mine
          : !!userId && userId === comment.author_id;
        const canDelete = isAnon
          ? comment.can_delete
          : isCommentAuthor || isPostAuthor;
        const displayName = isAnon
          ? comment.anon_label
          : (comment.profiles?.name ?? "알 수 없음");
        const isEditingThis = editingId === comment.id;

        return (
          <div key={comment.id} className="px-8 py-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center shrink-0 mt-0.5">
              <PersonIcon className="w-4 h-4 text-on-surface-variant" />
            </div>
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
                      if (e.key === "Enter") onEditSave();
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
                <p className="text-sm text-on-surface leading-relaxed mt-0.5">
                  {comment.content}
                </p>
              )}

              <p className="text-xs text-on-surface-variant mt-1">
                {formatDateTime(comment.created_at)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
