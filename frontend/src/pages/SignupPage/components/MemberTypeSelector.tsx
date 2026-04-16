type MemberType = "active" | "alumni";

type Props = {
  memberType: MemberType;
  onChange: (type: MemberType) => void;
};

export function MemberTypeSelector({ memberType, onChange }: Props) {
  return (
    <div>
      <label className="block text-sm font-semibold text-on-surface mb-2">회원 유형</label>
      <div className="grid grid-cols-2 gap-3">
        {(["active", "alumni"] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            className={`py-3 rounded-xl text-sm font-bold border-2 transition-all flex items-center justify-center gap-1.5 ${
              memberType === type
                ? "border-primary-container bg-primary-fixed text-primary-container"
                : "border-outline-variant/30 text-on-surface-variant hover:border-primary-container/30"
            }`}
          >
            <span className="material-symbols-outlined text-xl">
              {type === "active" ? "school" : "work"}
            </span>
            {type === "active" ? "현역 회원" : "졸업생 (선배)"}
          </button>
        ))}
      </div>
    </div>
  );
}
