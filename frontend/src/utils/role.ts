export const ROLE_BADGE: Record<string, { label: string; color: string }> = {
  staff: { label: "운영진", color: "bg-secondary-fixed text-on-secondary-fixed" },
  admin: { label: "관리자", color: "bg-error/15 text-error" },
};

export const ROLE_SEARCH_MAP: Record<string, string> = {
  "운영진": "staff",
  "관리자": "admin",
};
