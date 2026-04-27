interface AlumniTypeModalProps {
  isPending: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function AlumniTypeModal({ isPending, onConfirm, onClose }: AlumniTypeModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-surface-container-lowest rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-on-tertiary-container text-2xl mt-0.5">
            warning
          </span>
          <div>
            <h3 className="text-base font-bold text-on-surface">졸업생으로 변경</h3>
            <p className="text-sm text-on-surface-variant mt-1.5 leading-relaxed">
              한번 졸업생으로 변경하면{" "}
              <span className="font-bold text-on-tertiary-container">
                다시 현역으로 되돌릴 수 없습니다.
              </span>{" "}
              계속하시겠습니까?
            </p>
          </div>
        </div>
        <div className="flex gap-2 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-on-tertiary-container text-white hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {isPending ? "변경 중..." : "졸업생으로 변경"}
          </button>
        </div>
      </div>
    </div>
  );
}
