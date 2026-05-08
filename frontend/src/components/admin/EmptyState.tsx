interface EmptyStateProps {
  message: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant gap-2">
      <span className="material-symbols-outlined text-4xl">inbox</span>
      <p className="text-sm font-semibold">{message}</p>
    </div>
  );
}
