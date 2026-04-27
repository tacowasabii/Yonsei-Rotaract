const ROLE_LABELS: Record<string, string> = {
  user: "일반 회원",
  staff: "운영진",
  admin: "관리자",
  super_admin: "최고 관리자",
};

const ROLE_COLORS: Record<string, string> = {
  user: "bg-surface-container text-on-surface-variant",
  staff: "bg-secondary-fixed text-on-secondary-fixed",
  admin: "bg-primary-fixed text-primary-container",
  super_admin: "bg-error/10 text-error",
};

const ROLE_COLORS_DARK: Record<string, string> = {
  user: "bg-white/15 text-white/70",
  staff: "bg-white/25 text-white",
  admin: "bg-white/30 text-white",
  super_admin: "bg-error/60 text-white",
};

interface Props {
  role: string | null | undefined;
  /** true일 때 user(일반 회원) 뱃지도 표시 */
  showAll?: boolean;
  /** 어두운 배경 위에 표시할 때 사용 */
  variant?: "light" | "dark";
}

export default function RoleBadge({ role, showAll = false, variant = "light" }: Props) {
  if (!role || !ROLE_LABELS[role]) return null;
  if (!showAll && role === "user") return null;

  const colors = variant === "dark" ? ROLE_COLORS_DARK : ROLE_COLORS;

  return (
    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${colors[role]}`}>
      {ROLE_LABELS[role]}
    </span>
  );
}
