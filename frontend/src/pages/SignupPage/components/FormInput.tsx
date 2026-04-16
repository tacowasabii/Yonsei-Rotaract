import { UseFormRegisterReturn } from "react-hook-form";

const inputClass = (hasError: boolean) =>
  `w-full pl-11 pr-4 py-3 bg-surface-container rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant outline-none transition-all ${
    hasError ? "ring-2 ring-error" : "focus:ring-2 focus:ring-primary-container/30"
  }`;

const errorClass = "mt-1 text-xs text-error";

type Props = {
  label: string;
  icon: string;
  type?: string;
  placeholder: string;
  hasError: boolean;
  errorMessage?: string;
  inputProps: UseFormRegisterReturn;
};

export function FormInput({ label, icon, type = "text", placeholder, hasError, errorMessage, inputProps }: Props) {
  return (
    <div>
      <label className="block text-sm font-semibold text-on-surface mb-1.5">{label}</label>
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
          {icon}
        </span>
        <input
          type={type}
          placeholder={placeholder}
          className={inputClass(hasError)}
          {...inputProps}
        />
      </div>
      {hasError && errorMessage && <p className={errorClass}>{errorMessage}</p>}
    </div>
  );
}
