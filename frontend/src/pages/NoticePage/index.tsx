import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@components/layout/PageLayout";
import PageHeader from "@components/layout/PageHeader";
import { CampaignIcon, KeepIcon } from "@assets/icons";
import { usePosts } from "@/api/hooks/posts/usePosts";
import { useIsStaff } from "@/contexts/AuthContext";
import { NOTICE_POSTS_PER_PAGE, type Post } from "@/api/posts";
import { PATHS } from "@/routes/paths";
import Pagination from "@components/common/Pagination";
import RoleBadge from "@components/common/RoleBadge";
import { formatDate } from "@/utils/date";

function NoticeCard({ notice, onClick }: { notice: Post; onClick: () => void }) {
  return (
    <div className={`rounded-2xl shadow-card overflow-hidden ${
      notice.is_pinned
        ? "bg-primary-fixed/30 border-l-[3px] border-primary-container"
        : "bg-surface-container-lowest"
    }`}>
      <button
        className="w-full text-left p-5 hover:bg-primary-fixed/10 transition-colors"
        onClick={onClick}
      >
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center justify-center shrink-0 w-8 h-8 rounded-full bg-surface-container mt-0.5">
            <span className="text-xs font-bold text-on-surface-variant">{notice.post_number}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold text-on-surface">{notice.title}</h3>
              {notice.is_pinned && (
                <KeepIcon className="w-4 h-4 text-primary-container shrink-0 fill-current" />
              )}
            </div>
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
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = usePosts("notice", page, "", NOTICE_POSTS_PER_PAGE);

  const posts = data?.posts ?? [];
  const totalPages = Math.ceil((data?.totalCount ?? 0) / NOTICE_POSTS_PER_PAGE);

  return (
    <PageLayout>
      <PageHeader iconNode={<CampaignIcon />} title="공지사항" subtitle="중요한 공지와 안내사항을 확인하세요." />

      <div className="flex justify-end mb-6">
        {isStaff && (
          <button
            onClick={() => navigate(PATHS.NOTICE_WRITE)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-container text-white font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
            글쓰기
          </button>
        )}
      </div>

      <div className="space-y-3">
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

        {!isLoading && !isError && posts.length === 0 && (
          <div className="text-center py-12 text-sm text-on-surface-variant">
            아직 공지사항이 없습니다.
          </div>
        )}

        {!isLoading &&
          posts.map((notice) => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              onClick={() => navigate(`/notice/${notice.id}`)}
            />
          ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-10">
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      )}
    </PageLayout>
  );
}
