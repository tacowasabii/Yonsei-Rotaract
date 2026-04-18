interface StatCardProps {
  label: string;
  value: number;
  icon: string;
  color: string;
}

export default function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-card">
      <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center mb-3`}>
        <span className="material-symbols-outlined text-xl">{icon}</span>
      </div>
      <p className="text-2xl font-extrabold font-headline text-on-surface">{value}</p>
      <p className="text-xs text-on-surface-variant mt-0.5">{label}</p>
    </div>
  );
}
