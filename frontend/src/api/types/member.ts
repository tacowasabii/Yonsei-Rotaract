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
  company: string | null;
  job_title: string | null;
  is_company_public: boolean;
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

export type AlumniMember = Pick<Member,
  "id" | "name" | "email" | "admission_year" | "department" | "generation" | "company" | "job_title"
>;

export interface RejectedMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  member_type: "current" | "alumni" | null;
  admission_year: number | null;
  department: string | null;
  generation: string | null;
  role: AppRole;
  status: "rejected";
  created_at: string;
}
