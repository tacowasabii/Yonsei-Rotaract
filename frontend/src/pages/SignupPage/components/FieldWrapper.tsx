import type { ReactNode } from "react";
import { errorClass } from "./fieldStyles";

type Props = {
  label: string;
  hasError?: boolean;
  errorMessage?: string;
  children: ReactNode;
};

export function FieldWrapper({ label, hasError, errorMessage, children }: Props) {
  return (
    <div>
      <label className="block text-sm font-semibold text-on-surface mb-1.5">
        {label}
      </label>
      {children}
      {hasError && errorMessage && (
        <p className={errorClass}>{errorMessage}</p>
      )}
    </div>
  );
}
