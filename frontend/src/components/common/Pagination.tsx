const GROUP_SIZE = 10;

const btn = "w-9 h-9 flex items-center justify-center rounded-lg transition-colors text-on-surface-variant hover:bg-surface-container-high disabled:opacity-30 disabled:cursor-not-allowed";

interface Props {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages < 1) return null;

  const currentGroup = Math.ceil(page / GROUP_SIZE);
  const groupStart = (currentGroup - 1) * GROUP_SIZE + 1;
  const groupEnd = Math.min(currentGroup * GROUP_SIZE, totalPages);
  const pages = Array.from({ length: groupEnd - groupStart + 1 }, (_, i) => groupStart + i);

  const hasPrevGroup = currentGroup > 1;
  const hasNextGroup = currentGroup * GROUP_SIZE < totalPages;

  return (
    <div className="flex items-center gap-1.5">
      {/* 맨 처음 */}
      <button
        onClick={() => onChange(1)}
        disabled={page === 1}
        className={btn}
      >
        <span className="material-symbols-outlined text-xl">keyboard_double_arrow_left</span>
      </button>

      {/* 이전 그룹 마지막 페이지 */}
      <button
        onClick={() => onChange((currentGroup - 1) * GROUP_SIZE)}
        disabled={!hasPrevGroup}
        className={btn}
      >
        <span className="material-symbols-outlined text-xl">chevron_left</span>
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold transition-all ${
            p === page
              ? "bg-primary-container text-white"
              : "text-on-surface hover:bg-surface-container-high"
          }`}
        >
          {p}
        </button>
      ))}

      {/* 다음 그룹 첫 페이지 */}
      <button
        onClick={() => onChange(currentGroup * GROUP_SIZE + 1)}
        disabled={!hasNextGroup}
        className={btn}
      >
        <span className="material-symbols-outlined text-xl">chevron_right</span>
      </button>

      {/* 맨 끝 */}
      <button
        onClick={() => onChange(totalPages)}
        disabled={page === totalPages}
        className={btn}
      >
        <span className="material-symbols-outlined text-xl">keyboard_double_arrow_right</span>
      </button>
    </div>
  );
}
