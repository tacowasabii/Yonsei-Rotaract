export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return "-";
  const d = phone.replace(/\D/g, "");
  if (d.length === 11) return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
  return phone;
}

export { formatDate } from "@/utils/date";
