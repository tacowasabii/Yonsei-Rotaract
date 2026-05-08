import { useState, useRef, useEffect } from "react";
import { CalendarMonthIcon } from "@assets/icons";

const MONTHS = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

interface DatePickerProps {
  value: Date | null;
  onChange: (d: Date) => void;
}

export default function DatePicker({ value, onChange }: DatePickerProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(value?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(value?.getMonth() ?? today.getMonth());
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0); }
    else setViewMonth((m) => m + 1);
  };

  const displayValue = value
    ? `${value.getFullYear()}. ${value.getMonth() + 1}. ${value.getDate()}.`
    : "";

  const isSelected = (day: number) =>
    value?.getFullYear() === viewYear && value?.getMonth() === viewMonth && value?.getDate() === day;

  const isToday = (day: number) =>
    today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === day;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full px-4 py-3 bg-surface-container-low rounded-xl text-sm font-medium outline-none text-left transition-all ${
          open ? "ring-2 ring-primary-container/30" : ""
        } ${displayValue ? "text-on-surface" : "text-on-surface-variant/50"}`}
      >
        {displayValue || "날짜 선택"}
        <CalendarMonthIcon className="w-4 h-4 text-on-surface-variant float-right mt-0.5" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 z-50 bg-surface-container-lowest rounded-2xl shadow-xl p-4 w-72">
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={prevMonth}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-lg text-on-surface-variant">chevron_left</span>
            </button>
            <span className="text-sm font-bold text-on-surface">
              {viewYear}년 {MONTHS[viewMonth]}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-lg text-on-surface-variant">chevron_right</span>
            </button>
          </div>

          <div className="grid grid-cols-7 mb-1">
            {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
              <div key={d} className="text-center text-xs font-semibold text-on-surface-variant py-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => { onChange(new Date(viewYear, viewMonth, day)); setOpen(false); }}
                className={`w-8 h-8 mx-auto flex items-center justify-center rounded-full text-sm font-medium transition-all ${
                  isSelected(day)
                    ? "bg-primary-container text-white"
                    : isToday(day)
                    ? "bg-primary-fixed/40 text-primary-container font-bold"
                    : "hover:bg-surface-container text-on-surface"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
