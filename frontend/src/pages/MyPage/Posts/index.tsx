export default function MyPosts() {
  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-card flex flex-col items-center justify-center py-20 gap-3">
      <span className="material-symbols-outlined text-5xl text-on-surface-variant/40">article</span>
      <p className="text-sm font-semibold text-on-surface-variant">작성한 글이 없습니다</p>
      <p className="text-xs text-on-surface-variant/70">게시판에 글을 작성해보세요</p>
    </div>
  );
}
