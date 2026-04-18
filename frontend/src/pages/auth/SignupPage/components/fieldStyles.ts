export const inputClass = (hasError: boolean) =>
  `w-full pl-11 pr-4 py-3 bg-surface-container rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant outline-none transition-all ${
    hasError
      ? "ring-2 ring-error"
      : "focus:ring-2 focus:ring-primary-container/30"
  }`;

export const errorClass = "mt-2 text-xs text-error";
