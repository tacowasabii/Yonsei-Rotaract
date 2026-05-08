import { useState, useRef, useEffect } from "react";
import { CalendarMonthIcon } from "@assets/icons";

const MONTHS = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

interface MonthPickerProps {
  value: Date | null;
  onChange: (d: Date) => void;
}

export default function MonthPicker({ value, onChange }: MonthPickerProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(value?.getFullYear() ?? today.getFullYear());
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const displayValue = value
    ? `${value.getFullYear()}년 ${value.getMonth() + 1}월`
    : "";

  const isSelected = (monthIndex: number) =>
    value?.getFullYear() === viewYear && value?.getMonth() === monthIndex;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full px-4 py-3 bg-surface-container-low rounded-xl text-sm font-medium outline-none text-left transition-all ${
          open ? "ring-2 ring-primary-container/30" : ""
        } ${displayValue ? "text-on-surface" : "text-on-surface-variant/50"}`}
      >
        {displayValue || "월 선택"}
        <CalendarMonthIcon className="w-4 h-4 text-on-surface-variant float-right mt-0.5" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 z-50 bg-surface-container-lowest rounded-2xl shadow-xl p-4 w-64">
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => setViewYear((y) => y - 1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-lg text-on-surface-variant">chevron_left</span>
            </button>
            <span className="text-sm font-bold text-on-surface">{viewYear}년</span>
            <button
              type="button"
              onClick={() => setViewYear((y) => y + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-lg text-on-surface-variant">chevron_right</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {MONTHS.map((label, i) => (
              <button
                key={label}
                type="button"
                onClick={() => { onChange(new Date(viewYear, i, 1)); setOpen(false); }}
                className={`py-2 rounded-xl text-sm font-semibold transition-all ${
                  isSelected(i)
                    ? "bg-primary-container text-white"
                    : "hover:bg-surface-container text-on-surface"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
