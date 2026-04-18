export default function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-4">
      <span className="text-xs font-semibold text-on-surface-variant w-14 shrink-0">{label}</span>
      <span className="text-sm text-on-surface">{value}</span>
    </div>
  );
}
