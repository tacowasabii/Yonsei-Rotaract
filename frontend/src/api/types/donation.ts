export type DonationStatus = "pending" | "approved" | "rejected";

export interface DonationRecord {
  id: string;
  created_at: string;
  approved_at: string | null;
  is_anonymous: boolean;
  message: string | null;
  status: DonationStatus;
  is_hidden: boolean;
  profiles: {
    name: string;
    department: string | null;
    admission_year: number | null;
    generation: string | null;
  } | null;
}

export interface PublicDonation {
  id: string;
  approved_at: string;
  is_anonymous: boolean;
  message: string | null;
  profiles: {
    name: string;
    department: string | null;
    admission_year: number | null;
    generation: string | null;
  } | null;
}

export interface SubmitDonationParams {
  isAnonymous: boolean;
  message?: string;
}
