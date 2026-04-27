import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  useReceivedMessages,
  useSentMessages,
} from "@/api/hooks/messages/useMessages";
import type { MemberSearchResult } from "@/api/types/message";
import ComposeModal from "@components/common/ComposeModal";
import Pagination from "@components/common/Pagination";
import MessageRow from "./components/MessageRow";

const PER_PAGE = 15;

type Box = "received" | "sent";

export default function MyMessages() {
  const { user } = useAuth();
  const [activeBox, setActiveBox] = useState<Box>("received");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [composeOpen, setComposeOpen] = useState(false);
  const [replyRecipient, setReplyRecipient] = useState<MemberSearchResult | null>(null);

  const { data: received = [], isLoading: loadingReceived } = useReceivedMessages(user?.id);
  const { data: sent = [], isLoading: loadingSent } = useSentMessages(user?.id);

  const messages = activeBox === "received" ? received : sent;
  const isLoading = activeBox === "received" ? loadingReceived : loadingSent;
  const totalPages = Math.ceil(messages.length / PER_PAGE);
  const pagedMessages = messages.slice((page - 1) * PER_PAGE, page * PER_PAGE);

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
    setPage(1);
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
            pagedMessages.map((msg) => (
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
        {totalPages >= 1 && (
          <div className="flex justify-center pt-4">
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        )}
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
