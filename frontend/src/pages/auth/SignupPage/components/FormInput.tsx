import type { UseFormRegisterReturn } from "react-hook-form";
import { FieldWrapper } from "./FieldWrapper";
import { inputClass } from "./fieldStyles";

type Props = {
  label: string;
  icon: string;
  type?: string;
  placeholder: string;
  hasError: boolean;
  errorMessage?: string;
  inputProps: UseFormRegisterReturn;
};

export function FormInput({
  label,
  icon,
  type = "text",
  placeholder,
  hasError,
  errorMessage,
  inputProps,
}: Props) {
  return (
    <FieldWrapper label={label} hasError={hasError} errorMessage={errorMessage}>
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
    </FieldWrapper>
  );
}
