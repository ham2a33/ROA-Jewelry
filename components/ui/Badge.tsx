import { cn } from "@/lib/utils/cn";

type BadgeProps = {
  count: number;
  className?: string;
};

export function Badge({ count, className }: BadgeProps) {
  if (count <= 0) {
    return null;
  }

  const label = count > 99 ? "99+" : String(count);

  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-medium leading-none text-background",
        className,
      )}
    >
      {label}
    </span>
  );
}
