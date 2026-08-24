import { cn } from "@/lib/utils/cn";

type AdminButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
};

const variants = {
  primary:
    "bg-neutral-900 text-white hover:bg-neutral-800 disabled:bg-neutral-400",
  secondary:
    "border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50",
  ghost: "text-neutral-700 hover:bg-neutral-100",
  danger: "bg-rose-600 text-white hover:bg-rose-700 disabled:bg-rose-300",
};

const sizes = {
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-4 text-sm",
};

export function AdminButton({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: AdminButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
