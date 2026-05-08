interface TabItem<T extends string> {
  key: T;
  label: string;
  count?: number;
  showBadge?: boolean;
}

interface AdminTabBarProps<T extends string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onChange: (key: T) => void;
  variant?: "pill" | "segment";
}

export default function AdminTabBar<T extends string>({
  tabs,
  activeTab,
  onChange,
  variant = "pill",
}: AdminTabBarProps<T>) {
  if (variant === "segment") {
    return (
      <div className="flex gap-1 bg-surface-container rounded-xl p-1 w-fit">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === t.key
                ? "bg-white text-on-surface shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === t.key
              ? "bg-primary-container text-white"
              : "bg-surface-container-lowest text-on-surface-variant shadow-card hover:bg-primary-fixed/20"
          }`}
        >
          {t.label}
          {t.showBadge && t.count !== undefined && (
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                activeTab === t.key
                  ? "bg-white/20 text-white"
                  : "bg-surface-container text-on-surface-variant"
              }`}
            >
              {t.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
