import { useEffect } from "react";
import { AGREEMENT_CONTENTS, type AgreementType } from "./agreementContents";

type Props = {
  type: AgreementType | null;
  onClose: () => void;
};

export function AgreementModal({ type, onClose }: Props) {
  useEffect(() => {
    if (!type) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [type]);

  if (!type) return null;

  const content = AGREEMENT_CONTENTS[type];

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg bg-surface-container-lowest rounded-t-3xl sm:rounded-3xl shadow-card flex flex-col max-h-[85vh] sm:max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant shrink-0">
          <h2 className="font-headline font-extrabold text-base text-on-surface">
            {content.title}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors"
            aria-label="닫기"
          >
            <span className="material-symbols-outlined text-on-surface-variant text-xl">
              close
            </span>
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          {content.sections.map((section) => (
            <div key={section.heading} className="space-y-2">
              <h3 className="text-sm font-bold text-primary-container">
                {section.heading}
              </h3>
              <ul className="space-y-1">
                {section.paragraphs.map((para, i) => (
                  <li
                    key={i}
                    className="text-xs text-on-surface-variant leading-relaxed"
                  >
                    {para}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 하단 버튼 */}
        <div className="px-6 py-5 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-primary-container text-white font-bold text-sm rounded-xl active:scale-[0.98] transition-transform"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
