import { useState } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

const errorClass = "mt-2 text-xs text-error";

type Props = {
  label: string;
  placeholder: string;
  hasError: boolean;
  errorMessage?: string;
  inputProps: UseFormRegisterReturn;
};

export function PasswordField({
  label,
  placeholder,
  hasError,
  errorMessage,
  inputProps,
}: Props) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <label className="block text-sm font-semibold text-on-surface mb-1.5">
        {label}
      </label>
      <div
        className={`flex items-center bg-surface-container rounded-xl px-3.5 transition-all ${
          hasError
            ? "ring-2 ring-error"
            : "focus-within:ring-2 focus-within:ring-primary-container/30"
        }`}
      >
        <span className="material-symbols-outlined text-on-surface-variant text-xl shrink-0">
          lock
        </span>
        <input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          className="flex-1 px-2.5 py-3 bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant outline-none"
          {...inputProps}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="text-on-surface-variant hover:text-on-surface transition-colors shrink-0"
        >
          <span className="material-symbols-outlined text-xl">
            {show ? "visibility_off" : "visibility"}
          </span>
        </button>
      </div>
      {hasError && errorMessage && <p className={errorClass}>{errorMessage}</p>}
    </div>
  );
}
