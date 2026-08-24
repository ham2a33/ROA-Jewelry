import { cn } from "@/lib/utils/cn";

const fieldClass =
  "min-h-11 w-full rounded-md border border-border/70 bg-surface-elevated px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-200 focus-visible:border-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/25 disabled:cursor-not-allowed disabled:opacity-50";

export function StoreLabel({
  children,
  htmlFor,
  className,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}) {
  return (
    <label
      className={cn("mb-2 block text-sm text-foreground", className)}
      htmlFor={htmlFor}
    >
      {children}
    </label>
  );
}

export function StoreInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldClass, className)} {...props} />;
}

export function StoreTextarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        fieldClass,
        "min-h-24 resize-y py-3",
        className,
      )}
      {...props}
    />
  );
}

export function StoreSelect({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(fieldClass, className)} {...props}>
      {children}
    </select>
  );
}

export function StoreFieldHint({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("mt-2 text-sm text-muted-foreground", className)}>
      {children}
    </p>
  );
}
