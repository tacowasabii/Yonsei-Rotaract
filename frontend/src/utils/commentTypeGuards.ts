import type { Comment, AnonComment } from "@/api/comments";

export function isAnonComment(comment: Comment | AnonComment): comment is AnonComment {
  return "anon_label" in comment;
}
