import { useNavigate } from "react-router-dom";
import { formatDateTime } from "@/utils/date";
import { ChatBubbleIcon, FavoriteIcon } from "@assets/icons";
import { BOARD_PATHS } from "@/routes/paths";
import type { Post } from "@/api/posts";

interface PostRowProps {
  post: Post;
}

export default function PostRow({ post }: PostRowProps) {
  const navigate = useNavigate();
  const boardType = post.board_type === "promo" ? "promo" : "free";
  const boardLabel = post.board_type === "promo" ? "홍보게시판" : "자유게시판";
  const commentCount = post.comments?.[0]?.count ?? 0;
  const likeCount = post.post_likes?.[0]?.count ?? 0;

  return (
    <button
      onClick={() => navigate(BOARD_PATHS.post(boardType, post.id))}
      className="w-full px-6 py-3.5 flex items-center gap-3 hover:bg-surface-container-low transition-colors text-left group"
    >
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-fixed text-primary-container shrink-0">
        {boardLabel}
      </span>
      <p className="flex-1 min-w-0 text-sm font-semibold text-on-surface group-hover:text-primary-container transition-colors truncate">
        {post.title}
      </p>
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
        <span>{formatDateTime(post.created_at)}</span>
      </div>
    </button>
  );
}
