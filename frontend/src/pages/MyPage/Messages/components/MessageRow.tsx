import { formatDateTime } from "@/utils/date";
import { ROLE_BADGE } from "@/utils/role";
import {
  useMarkAsRead,
  useDeleteMessage,
} from "@/api/hooks/messages/useMessages";
import type { Message, MemberSearchResult } from "@/api/types/message";

type Box = "received" | "sent";

interface MessageRowProps {
  message: Message;
  box: Box;
  isExpanded: boolean;
  userId: string;
  onToggle: () => void;
  onReply?: (recipient: MemberSearchResult) => void;
}

export default function MessageRow({ message, box, isExpanded, userId, onToggle, onReply }: MessageRowProps) {
  const isUnread = box === "received" && !message.read_at;
  const { mutate: markAsRead } = useMarkAsRead();
  const { mutate: deleteMsg } = useDeleteMessage();

  function handleToggle() {
    if (isUnread) {
      markAsRead({ messageId: message.id, userId });
    }
    onToggle();
  }

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    deleteMsg({ messageId: message.id, box, userId });
  }

  function handleReply(e: React.MouseEvent) {
    e.stopPropagation();
    if (onReply && message.sender) {
      onReply({ id: message.sender_id, name: message.sender.name });
    }
  }

  const counterpartProfile = box === "received" ? message.sender : message.recipient;
  const counterpart = counterpartProfile?.name ?? "알 수 없음";
  const counterpartSub = [
    counterpartProfile?.department,
    counterpartProfile?.admission_year
      ? `${String(counterpartProfile.admission_year).slice(-2)}학번`
      : null,
    counterpartProfile?.generation ?? null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className={`border-b border-outline-variant/30 last:border-0 transition-colors ${isExpanded ? "bg-surface-container/40" : "hover:bg-surface-container/30"}`}>
      <button
        onClick={handleToggle}
        className="w-full flex items-center gap-3 px-5 py-4 text-left"
      >
        <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center shrink-0">
          <span className="text-sm font-black text-white">{counterpart.charAt(0)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`text-sm ${isUnread ? "font-black text-on-surface" : "font-semibold text-on-surface"}`}>
              {counterpart}
            </span>
            {counterpartProfile?.role && ROLE_BADGE[counterpartProfile.role] && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${ROLE_BADGE[counterpartProfile.role].color}`}>
                {ROLE_BADGE[counterpartProfile.role].label}
              </span>
            )}
            {counterpartSub && (
              <span className="text-xs text-on-surface-variant">{counterpartSub}</span>
            )}
            {isUnread && (
              <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
            )}
          </div>
          <p className={`text-sm truncate mt-0.5 ${isUnread ? "font-bold text-on-surface" : "text-on-surface-variant"}`}>
            {message.title}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-on-surface-variant">{formatDateTime(message.created_at)}</span>
          <span className={`material-symbols-outlined text-[18px] text-on-surface-variant transition-transform ${isExpanded ? "rotate-180" : ""}`}>
            expand_more
          </span>
        </div>
      </button>

      {isExpanded && (
        <div className="px-5 pb-5">
          <div className="bg-surface-container rounded-xl p-4 space-y-3">
            <p className="text-sm font-black text-on-surface">{message.title}</p>
            <p className="text-sm text-on-surface whitespace-pre-wrap leading-relaxed">
              {message.content}
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant/30">
              <button
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-error hover:bg-error/10 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
                삭제
              </button>
              {box === "received" && onReply && (
                <button
                  onClick={handleReply}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-primary text-white hover:opacity-90 transition-opacity"
                >
                  <span className="material-symbols-outlined text-[16px]">reply</span>
                  답장
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
