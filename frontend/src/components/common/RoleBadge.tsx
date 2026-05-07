import { ROLE_LABELS, ROLE_COLORS, ROLE_COLORS_DARK } from "@/constants/roles";
import type { AppRole } from "@/contexts/AuthContext";

interface Props {
  role: string | null | undefined;
  /** true일 때 user(일반 회원) 뱃지도 표시 */
  showAll?: boolean;
  /** 어두운 배경 위에 표시할 때 사용 */
  variant?: "light" | "dark";
}

export default function RoleBadge({ role, showAll = false, variant = "light" }: Props) {
  if (!role || !(role in ROLE_LABELS)) return null;
  if (!showAll && role === "user") return null;

  const colors = variant === "dark" ? ROLE_COLORS_DARK : ROLE_COLORS;

  return (
    <span className={`inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded ${colors[role as AppRole]}`}>
      {ROLE_LABELS[role as AppRole]}
    </span>
  );
}
