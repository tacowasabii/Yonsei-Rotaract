import ModalLayout from "@components/common/ModalLayout";
import { DownloadIcon } from "@assets/icons";
import { SpinnerIcon } from "@assets/icons";

interface Props {
  count: number;
  isPending: boolean;
  progress: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DownloadModal({ count, isPending, progress, onConfirm, onCancel }: Props) {
  return (
    <ModalLayout onClose={onCancel} variant="dialog" locked={isPending}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-primary-fixed/40 flex items-center justify-center shrink-0">
          <DownloadIcon className="w-5 h-5 text-primary-container" />
        </div>
        <h2 className="font-headline font-bold text-on-surface text-lg">사진 다운로드</h2>
      </div>

      {isPending ? (
        <div className="mb-6 space-y-3">
          <p className="text-sm text-on-surface-variant">
            {progress} / {count}장 다운로드 중...
          </p>
          <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-container rounded-full transition-all duration-300"
              style={{ width: `${(progress / count) * 100}%` }}
            />
          </div>
        </div>
      ) : (
        <p className="text-sm text-on-surface-variant mb-6">
          선택한 <span className="font-semibold text-on-surface">{count}장</span>을 다운로드합니다.
        </p>
      )}

      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          disabled={isPending}
          className="px-4 py-2 text-sm font-bold text-on-surface-variant rounded-full hover:bg-surface-container transition-colors disabled:opacity-50"
        >
          취소
        </button>
        <button
          onClick={onConfirm}
          disabled={isPending}
          className="flex items-center gap-1.5 px-5 py-2 text-sm font-bold rounded-full bg-primary-container text-white hover:opacity-80 transition-all disabled:opacity-50"
        >
          {isPending
            ? <SpinnerIcon className="w-3.5 h-3.5 animate-spin" />
            : <DownloadIcon className="w-3.5 h-3.5" />}
          {isPending ? "다운로드 중..." : "다운로드"}
        </button>
      </div>
    </ModalLayout>
  );
}
