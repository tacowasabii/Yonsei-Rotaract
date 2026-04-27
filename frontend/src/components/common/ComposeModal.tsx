import { useState, useRef } from "react";
import { useToast } from "@/contexts/ToastContext";
import { useSendMessage, useSearchMembers } from "@/api/hooks/messages/useMessages";
import type { MemberSearchResult } from "@/api/types/message";
import { CloseIcon } from "@assets/icons";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { ROLE_BADGE } from "@/utils/role";

interface Props {
  senderId: string;
  initialRecipient?: MemberSearchResult | null;
  onClose: () => void;
}

export default function ComposeModal({ senderId, initialRecipient, onClose }: Props) {
  const [recipient, setRecipient] = useState<MemberSearchResult | null>(
    initialRecipient ?? null
  );
  const [searchQuery, setSearchQuery] = useState(initialRecipient?.name ?? "");
  const [showDropdown, setShowDropdown] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitError, setSubmitError] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const { addToast } = useToast();
  const { data: searchResults = [] } = useSearchMembers(!recipient ? searchQuery : "");
  const { mutate: send, isPending } = useSendMessage();

  useOutsideClick(modalRef, onClose);
  useOutsideClick(searchRef, () => setShowDropdown(false));

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
      <div ref={modalRef} className="bg-surface-container-lowest rounded-2xl shadow-card w-full max-w-lg flex flex-col gap-5 p-6">
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
                <div className="flex items-center gap-2 bg-primary-fixed rounded-lg px-2 py-0.5">
                  <span className="text-sm font-bold text-primary-container leading-none">{recipient.name}</span>
                  <button onClick={handleClearRecipient} className="flex items-center text-primary-container/60 hover:text-error transition-colors">
                    <CloseIcon className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <input
                  className="flex-1 text-sm bg-transparent outline-none text-on-surface placeholder:text-on-surface-variant/50"
                  placeholder="이름으로 검색"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setShowDropdown(true); }}
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
                      className="w-full text-left px-4 py-3 hover:bg-surface-container transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-on-surface">{m.name}</span>
                        {m.role && ROLE_BADGE[m.role] && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${ROLE_BADGE[m.role].color}`}>
                            {ROLE_BADGE[m.role].label}
                          </span>
                        )}
                        <span className="text-xs text-on-surface-variant">
                          {[
                            m.department,
                            m.admission_year ? `${String(m.admission_year).slice(-2)}학번` : null,
                            m.generation ?? null,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </span>
                      </div>
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
