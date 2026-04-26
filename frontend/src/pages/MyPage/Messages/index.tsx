import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import {
  useReceivedMessages,
  useSentMessages,
  useSendMessage,
  useMarkAsRead,
  useDeleteMessage,
  useSearchMembers,
} from "@/api/hooks/useMessages";
import type { Message } from "@/api/types/message";
import type { MemberSearchResult } from "@/api/types/message";
import { formatDate } from "../shared";

type Box = "received" | "sent";

// ─── ComposeModal ──────────────────────────────────────────────────────────────

interface ComposeModalProps {
  senderId: string;
  initialRecipient?: MemberSearchResult | null;
  onClose: () => void;
}

function ComposeModal({ senderId, initialRecipient, onClose }: ComposeModalProps) {
  const [recipient, setRecipient] = useState<MemberSearchResult | null>(
    initialRecipient ?? null
  );
  const [searchQuery, setSearchQuery] = useState(initialRecipient?.name ?? "");
  const [showDropdown, setShowDropdown] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitError, setSubmitError] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  const { addToast } = useToast();
  const { data: searchResults = [] } = useSearchMembers(
    !recipient ? searchQuery : ""
  );
  const { mutate: send, isPending } = useSendMessage();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelectRecipient(member: MemberSearchResult) {
    setRecipient(member);
    setSearchQuery(member.name);
    setShowDropdown(false);
  }

  function handleClearRecipient() {
    setRecipient(null);
    setSearchQuery("");
  }

  function handleSubmit() {
    if (!recipient) { setSubmitError("수신자를 선택해주세요."); return; }
    if (!title.trim()) { setSubmitError("제목을 입력해주세요."); return; }
    if (!content.trim()) { setSubmitError("내용을 입력해주세요."); return; }
    if (recipient.id === senderId) { setSubmitError("자신에게는 쪽지를 보낼 수 없습니다."); return; }

    setSubmitError("");
    send(
      { senderId, recipientId: recipient.id, title: title.trim(), content: content.trim() },
      {
        onSuccess: () => {
          onClose();
          addToast(`${recipient.name}님께 쪽지를 보냈습니다.`, "success");
        },
      }
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-surface-container-lowest rounded-2xl shadow-card w-full max-w-lg flex flex-col gap-5 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-on-surface">쪽지 쓰기</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* 수신자 검색 */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-on-surface-variant">수신자</label>
          <div ref={searchRef} className="relative">
            <div className="flex items-center gap-2 border border-outline-variant rounded-xl px-3 py-2.5 bg-surface-container focus-within:border-primary transition-colors">
              {recipient ? (
                <div className="flex items-center gap-2 bg-primary-container/30 rounded-lg px-2 py-0.5">
                  <span className="text-sm font-bold text-on-surface">{recipient.name}</span>
                  <button onClick={handleClearRecipient} className="text-on-surface-variant hover:text-error transition-colors">
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>
              ) : (
                <input
                  className="flex-1 text-sm bg-transparent outline-none text-on-surface placeholder:text-on-surface-variant/50"
                  placeholder="이름으로 검색"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                />
              )}
            </div>
            {showDropdown && !recipient && searchQuery.trim() && (
              <div className="absolute top-full mt-1 left-0 right-0 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-card z-10 overflow-hidden max-h-48 overflow-y-auto">
                {searchResults.length === 0 ? (
                  <p className="text-sm text-on-surface-variant text-center py-4">검색 결과가 없습니다</p>
                ) : (
                  searchResults.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => handleSelectRecipient(m)}
                      className="w-full text-left px-4 py-3 text-sm font-semibold text-on-surface hover:bg-surface-container transition-colors"
                    >
                      {m.name}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* 제목 */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-on-surface-variant">제목</label>
          <input
            className="w-full border border-outline-variant rounded-xl px-3 py-2.5 text-sm bg-surface-container text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:border-primary transition-colors"
            placeholder="제목을 입력하세요"
            maxLength={100}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* 내용 */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-on-surface-variant">내용</label>
          <textarea
            className="w-full border border-outline-variant rounded-xl px-3 py-2.5 text-sm bg-surface-container text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:border-primary transition-colors resize-none"
            placeholder="내용을 입력하세요"
            maxLength={1000}
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <p className="text-right text-xs text-on-surface-variant">{content.length}/1000</p>
        </div>

        {submitError && (
          <p className="text-xs font-semibold text-error">{submitError}</p>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-bold text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="px-5 py-2.5 rounded-xl text-sm font-bold bg-primary text-white hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isPending ? "전송 중..." : "보내기"}
          </button>
        </div>
      </div>
    </div>
  );
}

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
      {/* 헤더 행 */}
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

      {/* 펼쳐진 내용 */}
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
        {/* 상단: 탭 + 쪽지 쓰기 */}
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

        {/* 메시지 목록 */}
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
