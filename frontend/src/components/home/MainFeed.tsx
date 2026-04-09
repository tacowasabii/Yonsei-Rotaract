const posts = [
  {
    board: "자유게시판",
    time: "3분 전",
    title: "백양로 벚꽃 아래에서 사진 찍으실 분 구해요!",
    excerpt:
      "내일 오후에 수업 끝나고 백양로 쪽에서 스냅사진 느낌으로 서로 찍어주실 분 계신가요? 필름 카메라 가져갈 예정입니다.",
    likes: 24,
    comments: 8,
    views: 152,
  },
  {
    board: "동아리 소식",
    time: "1시간 전",
    title: "지난 주말 봉사활동 현장 사진 업데이트 완료",
    excerpt:
      "안산 연희동 일대 벽화 그리기 봉사활동 사진들이 갤러리에 올라왔습니다. 다들 너무 수고 많으셨어요!",
    likes: 42,
    comments: 12,
    views: 310,
  },
  {
    board: "선배님한마디",
    time: "4시간 전",
    title: "취업준비 꿀팁 공유합니다 (IT/컨설팅 직군)",
    excerpt:
      "올해 로타랙트 졸업생으로서 취준하면서 겪은 것들 공유합니다. 자소서, 면접 등 궁금한 거 댓글로 남겨주세요.",
    likes: 58,
    comments: 23,
    views: 489,
  },
];

export default function MainFeed() {
  return (
    <section className="md:col-span-6 space-y-8">
      {/* Featured Hero Card - like main2 */}
      <div className="relative overflow-hidden rounded-2xl bg-primary text-white h-60 flex flex-col justify-end shadow-xl group cursor-pointer">
        <div className="absolute inset-0 z-0 bg-linear-to-br from-primary-container to-primary" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-1/2 -left-1/5 w-[150%] h-[150%] bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-size-[24px_24px]" />
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-primary via-primary/40 to-transparent z-10" />
        <div className="relative z-20 p-6 md:p-8">
          <span className="bg-tertiary-container text-on-tertiary-container text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block">
            HOT ISSUE
          </span>
          <h2 className="text-2xl md:text-3xl font-headline font-extrabold mb-2 leading-tight">
            2025 대동제 부스 기획안 모집 안내
          </h2>
          <p className="text-on-primary-container text-sm max-w-md opacity-90">
            올해 축제의 주인공은 바로 당신! 창의적인 아이디어로 우리 동아리만의
            특별한 부스를 만들어보세요.
          </p>
        </div>
      </div>

      {/* Recent Popular Posts */}
      <div className="space-y-4">
        <div className="flex justify-between items-end px-1">
          <h3 className="font-headline font-extrabold text-xl">최근 인기 게시물</h3>
          <button className="text-sm text-primary-container font-semibold flex items-center gap-1 hover:underline">
            전체보기
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
        <div className="space-y-3">
          {posts.map((post, i) => (
            <div
              key={i}
              className="bg-surface-container-lowest p-5 rounded-2xl shadow-card hover:bg-primary-fixed/30 transition-all cursor-pointer"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[11px] font-bold text-primary-container bg-primary-fixed px-2 py-0.5 rounded">
                  {post.board}
                </span>
                <span className="text-[11px] text-on-surface-variant">{post.time}</span>
              </div>
              <h4 className="font-bold text-on-surface mb-2">{post.title}</h4>
              <p className="text-sm text-on-surface-variant line-clamp-2 mb-4">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-[11px] text-on-surface-variant">
                  <span
                    className="material-symbols-outlined text-xs"
                    style={{ fontVariationSettings: '"FILL" 1' }}
                  >
                    favorite
                  </span>
                  <span>{post.likes}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-on-surface-variant">
                  <span className="material-symbols-outlined text-xs">chat_bubble</span>
                  <span>{post.comments}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-on-surface-variant">
                  <span className="material-symbols-outlined text-xs">visibility</span>
                  <span>{post.views}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
