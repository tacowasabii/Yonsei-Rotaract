import type { AppRole } from "@/contexts/AuthContext";

export const ROLE_LABELS: Record<AppRole, string> = {
  user: "일반 회원",
  staff: "운영진",
  admin: "관리자",
  super_admin: "최고 관리자",
};

export const ROLE_COLORS: Record<AppRole, string> = {
  user: "bg-surface-container text-on-surface-variant",
  staff: "bg-secondary-fixed text-on-secondary-fixed",
  admin: "bg-primary-fixed text-primary-container",
  super_admin: "bg-error/10 text-error",
};

export const ROLE_COLORS_DARK: Record<AppRole, string> = {
  user: "bg-white/15 text-white/70",
  staff: "bg-white/25 text-white",
  admin: "bg-white/30 text-white",
  super_admin: "bg-error/60 text-white",
};
