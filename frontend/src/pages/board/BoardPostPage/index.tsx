import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import PageLayout from "@components/layout/PageLayout";

const mockPost = {
  id: 1,
  num: 482,
  title: "백양로 벚꽃 아래에서 사진 찍으실 분 구해요!",
  author: "김연세",
  verified: true,
  date: "2025. 01. 12",
  views: 152,
  likes: 24,
  comments: 8,
  content: `내일 오후에 수업 끝나고 백양로 쪽에서 스냅사진 느낌으로 서로 찍어주실 분 계신가요? 필름 카메라 가져갈 예정입니다.

혼자 가기는 좀 외로울 것 같아서 같이 찍어줄 분 찾아요! 사진 찍는 것도 좋아하시는 분이면 더 좋겠습니다.

시간은 오후 3시~5시 사이로 생각하고 있어요. 편하게 댓글 달아주세요 :)`,
};

const mockComments = [
  { id: 1, author: "박서준", verified: false, date: "2025. 01. 12", content: "저 가고 싶어요! 필름 카메라 좋아해요 ㅎㅎ", likes: 3 },
  { id: 2, author: "이지은", verified: true, date: "2025. 01. 12", content: "저도 참여하고 싶은데 혹시 몇 명 정도 생각하세요?", likes: 1 },
  { id: 3, author: "최민호", verified: false, date: "2025. 01. 12", content: "오후 3시면 벚꽃 빛이 예쁠 것 같아요!", likes: 5 },
];

export default function BoardPostPage() {
  useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isPromo = location.pathname.includes("/promo/");
  const boardType = isPromo ? "promo" : "free";
  const boardLabel = isPromo ? "홍보게시판" : "자유게시판";

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(mockPost.likes);
  const [commentText, setCommentText] = useState("");

  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  return (
    <PageLayout>
      {/* Back + Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm text-on-surface-variant">
        <button
          onClick={() => navigate(`/board/${boardType}`)}
          className="flex items-center gap-1 hover:text-primary-container transition-colors font-semibold"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          {boardLabel}
        </button>
      </div>

      <div>
        {/* Post Card */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden mb-4">
          {/* Post Header */}
          <div className="px-8 pt-8 pb-6 border-b border-surface-container">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary-fixed text-primary-container">
                {boardLabel}
              </span>
              <span className="text-xs text-on-surface-variant">#{mockPost.num}</span>
            </div>
            <h1 className="text-2xl font-black text-on-surface font-headline leading-snug mb-4">
              {mockPost.title}
            </h1>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm text-primary-container">person</span>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold text-on-surface">{mockPost.author}</span>
                    {mockPost.verified && (
                      <span
                        className="material-symbols-outlined text-sm text-surface-tint"
                        style={{ fontVariationSettings: '"FILL" 1' }}
                      >
                        verified
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-on-surface-variant">{mockPost.date}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">visibility</span>
                  {mockPost.views}
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">chat_bubble</span>
                  {mockPost.comments}
                </span>
              </div>
            </div>
          </div>

          {/* Post Body */}
          <div className="px-8 py-8">
            <p className="text-on-surface leading-relaxed whitespace-pre-line text-[15px]">
              {mockPost.content}
            </p>
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

        {/* Comments */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="px-8 py-5 border-b border-surface-container">
            <h2 className="font-bold text-on-surface">
              댓글 <span className="text-primary-container">{mockPost.comments}</span>
            </h2>
          </div>

          {/* Comment List */}
          <div className="divide-y divide-surface-container">
            {mockComments.map((comment) => (
              <div key={comment.id} className="px-8 py-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-xs text-on-surface-variant">person</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-semibold text-on-surface">{comment.author}</span>
                      {comment.verified && (
                        <span
                          className="material-symbols-outlined text-sm text-surface-tint"
                          style={{ fontVariationSettings: '"FILL" 1' }}
                        >
                          verified
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-on-surface-variant">{comment.date}</span>
                  </div>
                  <button className="flex items-center gap-1 text-xs text-on-surface-variant hover:text-tertiary-container transition-colors shrink-0">
                    <span className="material-symbols-outlined text-base">favorite</span>
                    {comment.likes}
                  </button>
                </div>
                <p className="text-sm text-on-surface leading-relaxed ml-9">{comment.content}</p>
              </div>
            ))}
          </div>

          {/* Comment Input */}
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
    </PageLayout>
  );
}
