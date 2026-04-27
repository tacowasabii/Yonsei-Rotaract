interface Props {
  memberType: string | null | undefined;
}

export default function MemberTypeBadge({ memberType }: Props) {
  if (!memberType) return null;

  const isCurrent = memberType === "current";

  return (
    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
      isCurrent
        ? "bg-secondary-fixed text-on-secondary-fixed"
        : "bg-tertiary-fixed text-on-tertiary-fixed-variant"
    }`}>
      {isCurrent ? "현역" : "졸업생"}
    </span>
  );
}
