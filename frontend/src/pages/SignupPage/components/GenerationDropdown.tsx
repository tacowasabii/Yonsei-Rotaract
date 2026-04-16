import { useState, useRef, useEffect } from "react";
import type { UseFormRegister, UseFormSetValue, FieldError } from "react-hook-form";
import type { SignupFormValues } from "../types";
import { GENERATION_OPTIONS } from "../types";
import { errorClass } from "./fieldStyles";

type Props = {
  register: UseFormRegister<SignupFormValues>;
  setValue: UseFormSetValue<SignupFormValues>;
  error?: FieldError;
};

export function GenerationDropdown({ register, setValue, error }: Props) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value: string) => {
    setSelected(value);
    setValue("generation", value, { shouldValidate: true });
    setOpen(false);
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-on-surface mb-1.5">동아리 기수</label>
      <input type="hidden" {...register("generation", { required: "기수를 선택하세요." })} />
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={`w-full pl-11 pr-4 py-3 bg-surface-container rounded-xl text-sm text-left transition-all flex items-center justify-between ${
            error ? "ring-2 ring-error" : open ? "ring-2 ring-primary-container/30" : ""
          } ${selected ? "text-on-surface" : "text-on-surface-variant"}`}
        >
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
            tag
          </span>
          <span>{selected || "기수 선택"}</span>
          <span
            className={`material-symbols-outlined text-xl text-on-surface-variant transition-transform ${
              open ? "rotate-180" : ""
            }`}
          >
            expand_more
          </span>
        </button>

        {open && (
          <div className="absolute z-50 mt-1.5 w-full bg-surface-container-lowest rounded-2xl shadow-lg border border-outline-variant/20 overflow-hidden">
            <div className="max-h-64 overflow-y-auto">
              {GENERATION_OPTIONS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => handleSelect(g)}
                  className={`w-full px-4 py-2.5 text-sm text-left transition-colors ${
                    selected === g
                      ? "bg-primary-fixed text-primary-container font-bold"
                      : "text-on-surface hover:bg-surface-container"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {error && <p className={errorClass}>{error.message}</p>}
    </div>
  );
}
