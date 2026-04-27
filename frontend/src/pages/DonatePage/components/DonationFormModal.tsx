import { useState, useRef } from "react";
import { useOutsideClick } from "@/hooks/useOutsideClick";

interface Props {
  onClose: () => void;
}

export default function DonationFormModal({ onClose }: Props) {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useOutsideClick(modalRef, onClose);

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div
          ref={modalRef}
          className="bg-surface-container-lowest rounded-2xl shadow-card w-full max-w-md flex flex-col items-center gap-4 p-8 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center">
            <span
              className="material-symbols-outlined text-3xl text-primary-container"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              favorite
            </span>
          </div>
          <h2 className="text-lg font-black text-on-surface">
            후원 신청이 완료되었습니다
          </h2>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            위 계좌로 입금 후 관리자 확인 절차를 거쳐
            <br />
            명예의 전당에 등록됩니다. 감사합니다!
          </p>
          <button
            onClick={onClose}
            className="mt-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-primary text-white hover:opacity-90 transition-opacity"
          >
            확인
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        ref={modalRef}
        className="bg-surface-container-lowest rounded-2xl shadow-card w-full max-w-md flex flex-col gap-5 p-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-on-surface">후원 신청</h2>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* 계좌 안내 */}
        <div className="bg-primary-fixed/30 rounded-xl px-4 py-3 flex items-start gap-3">
          <span className="material-symbols-outlined text-primary-container text-xl mt-0.5">
            account_balance
          </span>
          <div>
            <p className="text-xs font-bold text-primary-container mb-0.5">
              후원 계좌
            </p>
            <p className="text-sm font-black text-primary-container">
              신한은행 110-000-000000
            </p>
            <p className="text-xs text-on-surface-variant">
              예금주: 연세대학교 로타랙트
            </p>
          </div>
        </div>

        {/* 익명 토글 */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-on-surface">익명으로 후원</p>
            <p className="text-xs text-on-surface-variant">
              명예의 전당에 이름 없이 표시됩니다
            </p>
          </div>
          <button
            onClick={() => setIsAnonymous((v) => !v)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              isAnonymous ? "bg-primary-container" : "bg-outline-variant"
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
                isAnonymous ? "left-7" : "left-1"
              }`}
            />
          </button>
        </div>

        {/* 응원 메시지 */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-on-surface-variant">
            응원 메시지{" "}
            <span className="font-normal">(선택)</span>
          </label>
          <textarea
            className="w-full border border-outline-variant rounded-xl px-3 py-2.5 text-sm bg-surface-container text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:border-primary transition-colors resize-none"
            placeholder="따뜻한 응원 한마디를 남겨주세요"
            maxLength={200}
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <p className="text-right text-xs text-on-surface-variant">
            {message.length}/200
          </p>
        </div>

        {/* 안내사항 */}
        <div className="bg-surface-container rounded-xl px-4 py-3 text-xs text-on-surface-variant leading-relaxed">
          <p className="font-bold text-on-surface mb-1">안내사항</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>신청 후 위 계좌로 입금해 주세요.</li>
            <li>
              관리자 확인 후 명예의 전당에 등록됩니다 (1–3일 소요).
            </li>
            <li>후원 금액은 공개되지 않습니다.</li>
          </ul>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-bold text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            취소
          </button>
          <button
            onClick={() => setSubmitted(true)}
            className="px-5 py-2.5 rounded-xl text-sm font-bold bg-primary text-white hover:opacity-90 transition-opacity"
          >
            신청하기
          </button>
        </div>
      </div>
    </div>
  );
}
