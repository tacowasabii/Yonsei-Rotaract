import { SpinnerIcon } from "@assets/icons";

export default function LoadingState() {
  return (
    <div className="flex items-center justify-center py-20 text-on-surface-variant">
      <SpinnerIcon className="w-8 h-8 animate-spin" />
    </div>
  );
}
