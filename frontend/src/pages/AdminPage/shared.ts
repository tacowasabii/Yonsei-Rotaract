import type { AppRole } from "@/contexts/AuthContext";
import type { Member } from "@/api/types/member";

export const ROLE_HIERARCHY: Record<AppRole, number> = {
  user: 1, staff: 2, admin: 3, super_admin: 4,
};

export const ROLE_META: Record<AppRole, { label: string; color: string }> = {
  user:        { label: "일반",       color: "bg-surface-container text-on-surface-variant" },
  staff:       { label: "운영진",     color: "bg-secondary-fixed text-on-secondary-fixed" },
  admin:       { label: "관리자",     color: "bg-error/15 text-error" },
  super_admin: { label: "슈퍼관리자", color: "bg-error text-white" },
};

export function assignableRoles(viewerRole: AppRole, targetRole: AppRole): AppRole[] {
  if (viewerRole === "super_admin") return ["user", "staff", "admin", "super_admin"];
  if (viewerRole === "admin" && ROLE_HIERARCHY[targetRole] < ROLE_HIERARCHY["admin"])
    return ["user", "staff"];
  return [];
}

export function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, "0")}. ${String(d.getDate()).padStart(2, "0")}`;
}

export const MOCK_MEMBERS: Member[] = [
  { id: "m2",  name: "이수현", email: "test_leesuhyun@rotaract.test",  phone: "01011110002", member_type: "current", admission_year: 2022, department: "사회학과",     generation: "37기", role: "admin",  status: "active",   created_at: "2023-03-01T00:00:00" },
  { id: "m3",  name: "박지민", email: "test_parkjimin@rotaract.test",  phone: "01011110003", member_type: "current", admission_year: 2023, department: "언론정보학과",  generation: "39기", role: "staff",  status: "active",   created_at: "2024-03-05T00:00:00" },
  { id: "m4",  name: "최윤서", email: "test_choiyunseo@rotaract.test", phone: "01011110004", member_type: "current", admission_year: 2020, department: "의류환경학과",  generation: "33기", role: "staff",  status: "active",   created_at: "2023-03-01T00:00:00" },
  { id: "m5",  name: "강민지", email: "test_kangminji@rotaract.test",  phone: "01011110005", member_type: "alumni",  admission_year: 2019, department: "경제학과",     generation: "33기", role: "staff",  status: "active",   created_at: "2022-06-20T00:00:00" },
  { id: "m6",  name: "정다은", email: "test_jungdaeun@rotaract.test",  phone: "01011110006", member_type: "current", admission_year: 2024, department: "심리학과",     generation: "41기", role: "user",   status: "active",   created_at: "2024-03-10T00:00:00" },
  { id: "m7",  name: "오현우", email: "test_ohhyunwoo@rotaract.test",  phone: "01011110007", member_type: "current", admission_year: 2023, department: "기계공학과",   generation: "39기", role: "user",   status: "active",   created_at: "2024-03-05T00:00:00" },
  { id: "m8",  name: "윤서준", email: "test_yoonseojun@rotaract.test", phone: "01011110008", member_type: "current", admission_year: 2022, department: "컴퓨터과학과", generation: "37기", role: "user",   status: "inactive", created_at: "2024-09-03T00:00:00" },
  { id: "m9",  name: "김도현", email: "test_kimdohyun@rotaract.test",  phone: "01011110009", member_type: "alumni",  admission_year: 2016, department: "경영학과",     generation: "28기", role: "user",   status: "active",   created_at: "2023-06-10T00:00:00" },
  { id: "m10", name: "이수진", email: "test_leesujin@rotaract.test",   phone: "01011110010", member_type: "alumni",  admission_year: 2017, department: "사회학과",     generation: "30기", role: "user",   status: "active",   created_at: "2024-01-15T00:00:00" },
];
