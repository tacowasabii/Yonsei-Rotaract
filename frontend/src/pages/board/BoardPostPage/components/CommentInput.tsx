import { useNavigate } from "react-router-dom";
import { PersonIcon } from "@assets/icons";
import { PATHS } from "@/routes/paths";

interface Props {
  isLoggedIn: boolean;
  commentText: string;
  isCreating: boolean;
  onTextChange: (text: string) => void;
  onSubmit: () => void;
}

export default function CommentInput({
  isLoggedIn,
  commentText,
  isCreating,
  onTextChange,
  onSubmit,
}: Props) {
  const navigate = useNavigate();

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) onSubmit();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onTextChange(e.target.value);
  }

  function handleLoginClick() {
    navigate(PATHS.LOGIN);
  }

  return (
    <div className="px-8 py-5 bg-surface-container-low border-t border-surface-container">
      {isLoggedIn ? (
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center shrink-0">
            <PersonIcon className="w-4 h-4 text-on-surface-variant" />
          </div>
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="댓글을 입력하세요..."
              className="flex-1 px-4 py-2.5 bg-white rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-container/30 transition-all placeholder:text-on-surface-variant shadow-card"
            />
            <button
              onClick={onSubmit}
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
            onClick={handleLoginClick}
            className="px-4 py-2 bg-primary-container text-white font-bold rounded-xl text-sm hover:opacity-90 transition-all shrink-0"
          >
            로그인하기
          </button>
        </div>
      )}
    </div>
  );
}
