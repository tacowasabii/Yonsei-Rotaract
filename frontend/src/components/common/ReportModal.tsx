import { useState } from "react";
import ModalLayout from "@components/common/ModalLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useSubmitReport } from "@/api/hooks/reports/useReports";

interface Props {
  onClose: () => void;
}

export default function ReportModal({ onClose }: Props) {
  const { profile } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const { mutate: submit, isPending } = useSubmitReport();

  function handleSubmit() {
    if (!profile) return;
    if (!title.trim()) { setError("제목을 입력해주세요."); return; }
    if (!content.trim()) { setError("내용을 입력해주세요."); return; }
    setError("");
    submit(
      { reporterId: profile.id, title: title.trim(), content: content.trim() },
      { onSuccess: () => setDone(true) }
    );
  }

  if (done || !profile) {
    return (
      <ModalLayout onClose={onClose} variant="dialog">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-xl text-primary">
              {done ? "check_circle" : "lock"}
            </span>
          </div>
          <h2 className="font-headline font-bold text-on-surface text-lg">
            {done ? "신고 접수 완료" : "로그인 필요"}
          </h2>
        </div>
        <p className="text-sm text-on-surface-variant mb-6">
          {done
            ? "신고가 접수되었습니다. 검토 후 조치하겠습니다."
            : "신고하려면 로그인이 필요합니다."}
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-bold rounded-full bg-primary text-white hover:opacity-80 transition-all"
          >
            확인
          </button>
        </div>
      </ModalLayout>
    );
  }

  return (
    <ModalLayout onClose={onClose} variant="form" locked={isPending}>
      <div className="flex items-center justify-between">
        <h2 className="text-base font-black text-on-surface">신고하기</h2>
        <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors">
          <span className="material-symbols-outlined text-[22px]">close</span>
        </button>
      </div>

      <div>
        <label className="text-xs font-bold text-on-surface-variant mb-1 block">제목</label>
        <input
          className="w-full border border-outline-variant rounded-xl px-3 py-2.5 text-sm bg-surface-container text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:border-primary transition-colors"
          placeholder="제목을 입력하세요"
          maxLength={100}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label className="text-xs font-bold text-on-surface-variant mb-1 block">내용</label>
        <textarea
          className="w-full border border-outline-variant rounded-xl px-3 py-2.5 text-sm bg-surface-container text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:border-primary transition-colors resize-none"
          placeholder="신고 내용을 구체적으로 입력해주세요"
          maxLength={1000}
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <p className="text-right text-xs text-on-surface-variant">{content.length}/1000</p>
      </div>

      {error && <p className="text-xs font-semibold text-error">{error}</p>}

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
          {isPending ? "제출 중..." : "신고 제출"}
        </button>
      </div>
    </ModalLayout>
  );
}
