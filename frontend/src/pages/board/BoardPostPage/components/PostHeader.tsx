import { useNavigate } from "react-router-dom";
import { formatDateTime } from "@/utils/date";
import RoleBadge from "@components/common/RoleBadge";
import { EditIcon, DeleteIcon, KeepIcon, KeepOffIcon } from "@assets/icons";
import type { Post, AnonPost } from "@/api/posts";
import type { BoardType } from "@/hooks/useBoardType";
import { BOARD_PATHS } from "@/routes/paths";

interface Props {
  post: Post | AnonPost;
  boardType: BoardType;
  boardLabel: string;
  isAnon: boolean;
  isNoticeBoard: boolean;
  isAuthor: boolean;
  onDeleteClick: () => void;
  onTogglePin: (isPinned: boolean) => void;
}

export default function PostHeader({
  post,
  boardType,
  boardLabel,
  isAnon,
  isNoticeBoard,
  isAuthor,
  onDeleteClick,
  onTogglePin,
}: Props) {
  const navigate = useNavigate();
  const regularPost = !isAnon ? (post as Post) : null;

  function handleEditClick() {
    const editPath = isNoticeBoard
      ? `/notice/${post.id}/edit`
      : BOARD_PATHS.edit(boardType, post.id);
    navigate(editPath);
  }

  return (
    <div className="px-8 pt-8 pb-6 border-b border-surface-container">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary-fixed text-primary-container">
          {boardLabel}
        </span>
        {isNoticeBoard && post.is_pinned && (
          <KeepIcon className="w-5 h-5 text-primary-container fill-current" />
        )}
        {!isNoticeBoard && post.is_notice && (
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary-container text-white">
            공지
          </span>
        )}
        <span className="text-xs text-on-surface-variant">#{post.post_number}</span>
      </div>

      <h1 className="text-2xl font-black text-on-surface font-headline leading-snug mb-4">
        {post.title}
      </h1>

      <div className="flex items-center justify-between">
        <div className="flex items-end gap-1.5">
          <span className="text-sm font-semibold text-on-surface">
            {isAnon ? "익명" : (regularPost?.profiles?.name ?? "알 수 없음")}
          </span>
          {!isAnon && <RoleBadge role={regularPost?.profiles?.role} />}
          <span className="text-xs text-on-surface-variant">·</span>
          <span className="text-xs text-on-surface-variant">
            {formatDateTime(post.created_at)}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isAuthor && isNoticeBoard && regularPost && (
            <button
              onClick={() => onTogglePin(regularPost.is_pinned)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-on-surface-variant bg-surface-container hover:bg-surface-container-high transition-all"
            >
              <KeepOffIcon className="w-4 h-4" />
              {regularPost.is_pinned ? "고정 해제" : "고정"}
            </button>
          )}
          {isAuthor && (
            <div className="flex items-center gap-1">
              <button
                onClick={handleEditClick}
                className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-all"
                aria-label="수정"
              >
                <EditIcon className="w-4 h-4" />
              </button>
              <button
                onClick={onDeleteClick}
                className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-all"
                aria-label="삭제"
              >
                <DeleteIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
