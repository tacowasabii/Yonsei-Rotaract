import type { AppRole } from "@/contexts/AuthContext";

export type { AppRole };

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  member_type: "current" | "alumni" | null;
  admission_year: number | null;
  department: string | null;
  generation: string | null;
  role: AppRole;
  status: "active" | "inactive";
  created_at: string;
}

export interface PendingMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  member_type: "current" | "alumni" | null;
  admission_year: number | null;
  department: string | null;
  generation: string | null;
  role: AppRole;
  status: "pending";
  created_at: string;
}
