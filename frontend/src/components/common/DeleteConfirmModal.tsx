import ModalLayout from "@components/common/ModalLayout";

interface Props {
  title: string;
  description: string;
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({ title, description, isPending, onConfirm, onCancel }: Props) {
  return (
    <ModalLayout onClose={onCancel} variant="dialog" locked={isPending}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-xl text-error">delete</span>
        </div>
        <h2 className="font-headline font-bold text-on-surface text-lg">{title}</h2>
      </div>
      <p className="text-sm text-on-surface-variant mb-6">{description}</p>
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
          className="flex items-center gap-1.5 px-5 py-2 text-sm font-bold rounded-full bg-error text-white hover:opacity-80 transition-all disabled:opacity-50"
        >
          {isPending && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          {isPending ? "삭제 중..." : "삭제"}
        </button>
      </div>
    </ModalLayout>
  );
}
