import { useState } from "react";
import PageLayout from "@components/layout/PageLayout";
import PageHeader from "@components/layout/PageHeader";

const notices = [
  {
    id: 1,
    important: true,
    category: "중요",
    title: "신입 회원 환영회 장소 변경 안내",
    date: "2025. 04. 08",
    views: 342,
    author: "운영진",
    content:
      "4월 15일 예정된 신입 회원 환영회 장소가 '공학원 세미나실'에서 '학생회관 소강당'으로 변경되었습니다. 주차는 학생회관 지하 1층을 이용해 주세요.",
  },
  {
    id: 2,
    important: true,
    category: "중요",
    title: "2025년 연간 회원비 납부 안내",
    date: "2025. 04. 05",
    views: 281,
    author: "총무",
    content:
      "2025년도 연간 회원비 납부 기한이 4월 30일로 연장되었습니다. 계좌번호: 신한은행 110-000-000000 (예금주: 연세로타랙트). 납부 후 카톡으로 인증해주세요.",
  },
  {
    id: 3,
    important: false,
    category: "일반",
    title: "시험기간 스터디룸 대여 신청 방법",
    date: "2025. 04. 02",
    views: 198,
    author: "학술부",
    content:
      "중간고사 기간(4/21~4/25) 스터디룸 대여를 원하시는 분들은 구글폼을 통해 신청해 주세요. 선착순 배정이며, 팀당 최대 4시간입니다.",
  },
  {
    id: 4,
    important: false,
    category: "일반",
    title: "4월 정기 집회 아젠다 및 참석 확인",
    date: "2025. 03. 28",
    views: 254,
    author: "운영진",
    content:
      "4월 정기 집회(4/15, 19:00)에 참석 여부를 댓글로 남겨주세요. 아젠다: ① 신입 회원 소개 ② 봉사활동 계획 논의 ③ 기타 안건",
  },
  {
    id: 5,
    important: false,
    category: "일반",
    title: "로타랙트 공식 SNS 채널 리뉴얼 안내",
    date: "2025. 03. 25",
    views: 173,
    author: "홍보부",
    content: "공식 인스타그램 계정이 @yonsei_rotaract_official로 변경되었습니다. 팔로우하시면 소식을 빠르게 받아보실 수 있습니다.",
  },
  {
    id: 6,
    important: false,
    category: "일반",
    title: "동아리방 냉장고 청소의 날 공지",
    date: "2025. 03. 20",
    views: 112,
    author: "총무",
    content: "3월 25일(화) 오후 6시에 동아리방 냉장고 정리를 진행합니다. 보관 물품이 있으신 분들은 미리 가져가 주시기 바랍니다.",
  },
];

const filters = ["전체", "중요", "일반"];

export default function NoticePage() {
  const [activeFilter, setActiveFilter] = useState("전체");
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered =
    activeFilter === "전체"
      ? notices
      : notices.filter((n) =>
          activeFilter === "중요" ? n.important : !n.important
        );

  return (
    <PageLayout>
      <PageHeader icon="campaign" title="공지사항" subtitle="중요한 공지와 안내사항을 확인하세요." />

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
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

      {/* Notice List */}
      <div className="space-y-3">
        {filtered.map((notice) => (
          <div
            key={notice.id}
            className="bg-surface-container-lowest rounded-2xl shadow-card overflow-hidden"
          >
            <button
              className="w-full text-left p-5 hover:bg-primary-fixed/10 transition-colors"
              onClick={() => setExpanded(expanded === notice.id ? null : notice.id)}
            >
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center justify-center shrink-0 w-8 h-8 rounded-full bg-surface-container mt-0.5">
                  <span className="text-xs font-bold text-on-surface-variant">{notice.id}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {notice.important && (
                      <span className="text-[10px] font-bold text-error bg-error/10 px-2 py-0.5 rounded">
                        IMPORTANT
                      </span>
                    )}
                    <span className="text-[11px] text-on-surface-variant">{notice.category}</span>
                  </div>
                  <h3 className="font-semibold text-on-surface">{notice.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-on-surface-variant">
                    <span>{notice.author}</span>
                    <span>{notice.date}</span>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">visibility</span>
                      <span>{notice.views}</span>
                    </div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant transition-transform shrink-0" style={{ transform: expanded === notice.id ? "rotate(180deg)" : "rotate(0deg)" }}>
                  expand_more
                </span>
              </div>
            </button>

            {expanded === notice.id && (
              <div className="px-5 pb-5 pt-0 border-t border-outline-variant/20">
                <p className="text-sm text-on-surface leading-relaxed mt-4">
                  {notice.content}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-10">
        {[1, 2, 3].map((p) => (
          <button
            key={p}
            className={`w-9 h-9 rounded-full text-sm font-semibold transition-all ${
              p === 1
                ? "bg-primary-container text-white"
                : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
    </PageLayout>
  );
}
