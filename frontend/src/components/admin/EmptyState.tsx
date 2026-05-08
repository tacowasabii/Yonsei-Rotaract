import { InboxIcon } from '@/assets/icons';

interface EmptyStateProps {
  message: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant gap-2">
      <InboxIcon className="w-9 h-9" />
      <p className="text-sm font-semibold">{message}</p>
    </div>
  );
}
