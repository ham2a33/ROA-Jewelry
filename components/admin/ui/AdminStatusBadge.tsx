import { cn } from "@/lib/utils/cn";

type AdminStatusBadgeProps = {
  label: string;
  className?: string;
};

export function AdminStatusBadge({ label, className }: AdminStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        className,
      )}
    >
      {label}
    </span>
  );
}
