interface Props {
  title: string;
  description: string;
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({ title, description, isPending, onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-red-500">delete</span>
          </div>
          <div>
            <p className="font-bold text-on-surface">{title}</p>
            <p className="text-sm text-on-surface-variant">{description}</p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            disabled={isPending}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-on-surface-variant bg-surface-container hover:bg-surface-container-high transition-all disabled:opacity-60"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-all disabled:opacity-60"
          >
            {isPending && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {isPending ? "삭제 중..." : "삭제"}
          </button>
        </div>
      </div>
    </div>
  );
}
