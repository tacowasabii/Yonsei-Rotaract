import type { AppRole } from "@/contexts/AuthContext";

export const ROLE_HIERARCHY: Record<AppRole, number> = {
  user: 1, staff: 2, admin: 3, super_admin: 4,
};

export const ROLE_META: Record<AppRole, { label: string; color: string }> = {
  user:        { label: "일반",       color: "bg-surface-container text-on-surface-variant" },
  staff:       { label: "운영진",     color: "bg-secondary-fixed text-on-secondary-fixed" },
  admin:       { label: "관리자",     color: "bg-error/15 text-error" },
  super_admin: { label: "슈퍼관리자", color: "bg-error text-white" },
};

export function isAdminOrAbove(role: AppRole | null): boolean {
  return role === "admin" || role === "super_admin";
}

export function assignableRoles(viewerRole: AppRole, targetRole: AppRole): AppRole[] {
  if (viewerRole === "super_admin") return ["user", "staff", "admin", "super_admin"];
  if (viewerRole === "admin" && ROLE_HIERARCHY[targetRole] < ROLE_HIERARCHY["admin"])
    return ["user", "staff"];
  return [];
}

export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return "-";
  const d = phone.replace(/\D/g, "");
  if (d.length === 11) return `${d.slice(0,3)}-${d.slice(3,7)}-${d.slice(7)}`;
  if (d.length === 10) return `${d.slice(0,3)}-${d.slice(3,6)}-${d.slice(6)}`;
  return phone;
}

export function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, "0")}. ${String(d.getDate()).padStart(2, "0")}`;
}

