import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@components/layout/PageLayout";
import PageHeader from "@components/layout/PageHeader";
import { CampaignIcon } from "@assets/icons";
import { usePosts } from "@/api/hooks/posts/usePosts";
import { usePinnedPosts } from "@/api/hooks/posts/usePinnedPosts";
import { useIsStaff } from "@/contexts/AuthContext";
import { NOTICE_POSTS_PER_PAGE, type Post } from "@/api/posts";
import { PATHS } from "@/routes/paths";
import Pagination from "@components/common/Pagination";
import RoleBadge from "@components/common/RoleBadge";
import { formatDate } from "@/utils/date";

const FILTERS = ["전체", "중요", "일반"] as const;
type Filter = (typeof FILTERS)[number];

function NoticeCard({ notice, onClick }: { notice: Post; onClick: () => void }) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-card overflow-hidden">
      <button
        className="w-full text-left p-5 hover:bg-primary-fixed/10 transition-colors"
        onClick={onClick}
      >
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center justify-center shrink-0 w-8 h-8 rounded-full bg-surface-container mt-0.5">
            <span className="text-xs font-bold text-on-surface-variant">{notice.post_number}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {notice.is_pinned && (
                <span className="text-[10px] font-bold text-error bg-error/10 px-2 py-0.5 rounded">
                  IMPORTANT
                </span>
              )}
              <span className="text-[11px] text-on-surface-variant">
                {notice.is_pinned ? "중요" : "일반"}
              </span>
            </div>
            <h3 className="font-semibold text-on-surface">{notice.title}</h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-[11px] text-on-surface-variant">
                {notice.profiles?.name ?? "—"}
              </span>
              <RoleBadge role={notice.profiles?.role} />
              <span className="text-[11px] text-on-surface-variant">
                {formatDate(notice.created_at)}
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant shrink-0 mt-0.5">
            chevron_right
          </span>
        </div>
      </button>
    </div>
  );
}

export default function NoticePage() {
  const navigate = useNavigate();
  const isStaff = useIsStaff();
  const [activeFilter, setActiveFilter] = useState<Filter>("전체");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = usePosts("notice", page, "", NOTICE_POSTS_PER_PAGE);
  const { data: pinnedPosts = [] } = usePinnedPosts();

  const regularPosts = data?.posts ?? [];
  const totalPages = Math.ceil((data?.totalCount ?? 0) / NOTICE_POSTS_PER_PAGE);

  const showPinned = activeFilter === "전체" || activeFilter === "중요";
  const showRegular = activeFilter === "전체" || activeFilter === "일반";
  const showPagination = activeFilter !== "중요";

  const handleFilterChange = (f: Filter) => {
    setActiveFilter(f);
    setPage(1);
  };

  return (
    <PageLayout>
      <PageHeader iconNode={<CampaignIcon />} title="공지사항" subtitle="중요한 공지와 안내사항을 확인하세요." />

      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => handleFilterChange(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                activeFilter === f
                  ? "bg-primary-container text-white"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        {isStaff && (
          <button
            onClick={() => navigate(PATHS.NOTICE_WRITE)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-container text-white font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all text-sm"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
            글쓰기
          </button>
        )}
      </div>

      <div className="space-y-3">
        {/* 고정글 */}
        {showPinned &&
          pinnedPosts.map((notice) => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              onClick={() => navigate(`/notice/${notice.id}`)}
            />
          ))}

        {/* "중요" 탭에서 고정글 없음 */}
        {activeFilter === "중요" && pinnedPosts.length === 0 && (
          <div className="text-center py-12 text-sm text-on-surface-variant">
            고정된 공지가 없습니다.
          </div>
        )}

        {/* 일반 공지글 */}
        {showRegular && (
          <>
            {isLoading &&
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-surface-container-lowest rounded-2xl shadow-card p-5 animate-pulse"
                >
                  <div className="h-4 bg-surface-container rounded w-3/4 mb-2" />
                  <div className="h-3 bg-surface-container rounded w-1/3" />
                </div>
              ))}

            {isError && (
              <div className="text-center py-12 text-sm text-on-surface-variant">
                공지사항을 불러오지 못했습니다.
              </div>
            )}

            {!isLoading &&
              !isError &&
              regularPosts.length === 0 &&
              (activeFilter === "일반" || pinnedPosts.length === 0) && (
                <div className="text-center py-12 text-sm text-on-surface-variant">
                  아직 공지사항이 없습니다.
                </div>
              )}

            {!isLoading &&
              regularPosts.map((notice) => (
                <NoticeCard
                  key={notice.id}
                  notice={notice}
                  onClick={() => navigate(`/notice/${notice.id}`)}
                />
              ))}
          </>
        )}
      </div>

      {showPagination && totalPages > 1 && (
        <div className="flex justify-center mt-10">
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      )}
    </PageLayout>
  );
}
