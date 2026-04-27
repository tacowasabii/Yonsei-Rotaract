const ROLE_LABELS: Record<string, string> = {
  staff: "운영진",
  admin: "관리자",
  super_admin: "최고 관리자",
};

const ROLE_COLORS: Record<string, string> = {
  staff: "bg-secondary-fixed text-on-secondary-fixed",
  admin: "bg-primary-fixed text-primary-container",
  super_admin: "bg-error/10 text-error",
};

interface Props {
  role: string | null | undefined;
}

export default function RoleBadge({ role }: Props) {
  if (!role || !ROLE_LABELS[role]) return null;

  return (
    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${ROLE_COLORS[role]}`}>
      {ROLE_LABELS[role]}
    </span>
  );
}
