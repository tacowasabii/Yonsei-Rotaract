interface SortHeaderButtonProps {
  label: string;
  sortKey: string;
  activeSortKey: string | null;
  sortDir: "asc" | "desc";
  onSort: () => void;
}

export default function SortHeaderButton({ label, sortKey, activeSortKey, sortDir, onSort }: SortHeaderButtonProps) {
  const icon = activeSortKey !== sortKey ? "unfold_more" : sortDir === "asc" ? "arrow_upward" : "arrow_downward";

  return (
    <button onClick={onSort} className="flex items-center gap-0.5 hover:text-on-surface transition-colors">
      {label} <span className="material-symbols-outlined text-sm">{icon}</span>
    </button>
  );
}
