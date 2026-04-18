const errorClass = "mt-1 text-xs text-error";

type AgreementsState = {
  terms: boolean;
  privacy: boolean;
  optional: boolean;
};

type Props = {
  agreements: AgreementsState;
  agreedAll: boolean;
  onAll: (checked: boolean) => void;
  onSingle: (key: keyof AgreementsState, checked: boolean) => void;
  submitAttempted: boolean;
};

export function AgreementsSection({ agreements, agreedAll, onAll, onSingle, submitAttempted }: Props) {
  return (
    <div className="space-y-3 pt-1">
      <label className="flex items-center gap-3 p-4 bg-primary-fixed/30 rounded-xl cursor-pointer">
        <input
          type="checkbox"
          checked={agreedAll}
          onChange={(e) => onAll(e.target.checked)}
          className="w-5 h-5 accent-primary-container rounded"
        />
        <span className="font-bold text-primary-container text-sm">전체 동의</span>
      </label>

      <div className="space-y-3 pl-2">
        {(
          [
            { key: "terms" as const, label: "이용약관 동의", required: true },
            { key: "privacy" as const, label: "개인정보 수집 및 이용 동의", required: true },
            { key: "optional" as const, label: "마케팅 정보 수신 동의 (선택)", required: false },
          ] as const
        ).map(({ key, label, required }) => (
          <label key={key} className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={agreements[key]}
                onChange={(e) => onSingle(key, e.target.checked)}
                className="w-4 h-4 accent-primary-container rounded"
              />
              <span className="text-sm text-on-surface">{label}</span>
              {required && <span className="text-[10px] font-bold text-error">[필수]</span>}
            </div>
            <span className="material-symbols-outlined text-on-surface-variant text-sm">
              chevron_right
            </span>
          </label>
        ))}
      </div>

      <div className="bg-surface-container rounded-xl p-4">
        <p className="text-xs text-on-surface-variant leading-relaxed">
          연세 로타랙트 커뮤니티는 회원 정보를 안전하게 관리합니다.
          수집된 정보는 서비스 제공 목적으로만 사용되며, 제3자에게 제공되지 않습니다.
        </p>
      </div>

      {submitAttempted && (!agreements.terms || !agreements.privacy) && (
        <p className={errorClass}>필수 약관에 동의해주세요.</p>
      )}
    </div>
  );
}
