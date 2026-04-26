export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  title: string;
  content: string;
  read_at: string | null;
  is_deleted_by_sender: boolean;
  is_deleted_by_recipient: boolean;
  created_at: string;
  sender: { name: string } | null;
  recipient: { name: string } | null;
}

export interface MemberSearchResult {
  id: string;
  name: string;
}
