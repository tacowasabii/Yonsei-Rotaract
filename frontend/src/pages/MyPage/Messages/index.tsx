import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { formatDate } from "@/utils/date";
import {
  useReceivedMessages,
  useSentMessages,
  useMarkAsRead,
  useDeleteMessage,
} from "@/api/hooks/messages/useMessages";
import type { Message } from "@/api/types/message";
import type { MemberSearchResult } from "@/api/types/message";
import ComposeModal from "@components/common/ComposeModal";

type Box = "received" | "sent";

// ─── MessageRow ────────────────────────────────────────────────────────────────

interface MessageRowProps {
  message: Message;
  box: Box;
  isExpanded: boolean;
  userId: string;
  onToggle: () => void;
  onReply?: (recipient: MemberSearchResult) => void;
}

function MessageRow({ message, box, isExpanded, userId, onToggle, onReply }: MessageRowProps) {
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

  const counterpart =
    box === "received"
      ? (message.sender?.name ?? "알 수 없음")
      : (message.recipient?.name ?? "알 수 없음");

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
            {isUnread && (
              <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
            )}
          </div>
          <p className={`text-sm truncate mt-0.5 ${isUnread ? "font-bold text-on-surface" : "text-on-surface-variant"}`}>
            {message.title}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-on-surface-variant">{formatDate(message.created_at)}</span>
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-on-surface-variant hover:bg-error/10 hover:text-error transition-colors"
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

// ─── MyMessages ────────────────────────────────────────────────────────────────

export default function MyMessages() {
  const { user } = useAuth();
  const [activeBox, setActiveBox] = useState<Box>("received");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [replyRecipient, setReplyRecipient] = useState<MemberSearchResult | null>(null);

  const { data: received = [], isLoading: loadingReceived } = useReceivedMessages(user?.id);
  const { data: sent = [], isLoading: loadingSent } = useSentMessages(user?.id);

  const messages = activeBox === "received" ? received : sent;
  const isLoading = activeBox === "received" ? loadingReceived : loadingSent;

  function handleToggle(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  function handleReply(recipient: MemberSearchResult) {
    setReplyRecipient(recipient);
    setComposeOpen(true);
  }

  function handleCloseCompose() {
    setComposeOpen(false);
    setReplyRecipient(null);
  }

  function handleTabChange(box: Box) {
    setActiveBox(box);
    setExpandedId(null);
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="bg-surface-container rounded-2xl p-1 flex gap-1">
            {(["received", "sent"] as const).map((box) => (
              <button
                key={box}
                onClick={() => handleTabChange(box)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeBox === box
                    ? "bg-surface-container-lowest text-on-surface shadow-card"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {box === "received" ? "받은쪽지함" : "보낸쪽지함"}
              </button>
            ))}
          </div>
          <button
            onClick={() => setComposeOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-primary text-white hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
            쪽지 쓰기
          </button>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl shadow-card overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant/40">mail</span>
              <p className="text-sm font-semibold text-on-surface-variant">
                {activeBox === "received" ? "받은 쪽지가 없습니다" : "보낸 쪽지가 없습니다"}
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <MessageRow
                key={msg.id}
                message={msg}
                box={activeBox}
                isExpanded={expandedId === msg.id}
                userId={user!.id}
                onToggle={() => handleToggle(msg.id)}
                onReply={activeBox === "received" ? handleReply : undefined}
              />
            ))
          )}
        </div>
      </div>

      {composeOpen && user && (
        <ComposeModal
          senderId={user.id}
          initialRecipient={replyRecipient}
          onClose={handleCloseCompose}
        />
      )}
    </>
  );
}
