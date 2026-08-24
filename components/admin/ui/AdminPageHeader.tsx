import Link from "next/link";
import { cn } from "@/lib/utils/cn";

type AdminPageHeaderProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
};

export function AdminPageHeader({
  title,
  description,
  actions,
  breadcrumbs,
}: AdminPageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-neutral-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav className="mb-2 flex flex-wrap items-center gap-1 text-xs text-neutral-500">
            {breadcrumbs.map((item, index) => (
              <span key={`${item.label}-${index}`} className="inline-flex items-center gap-1">
                {index > 0 ? <span>/</span> : null}
                {item.href ? (
                  <Link href={item.href} className="hover:text-neutral-900">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-neutral-700">{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        ) : null}
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 text-sm text-neutral-500">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

type AdminCardProps = {
  title?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
};

export function AdminCard({ title, children, className, action }: AdminCardProps) {
  return (
    <section
      className={cn(
        "rounded-lg border border-neutral-200 bg-white shadow-sm",
        className,
      )}
    >
      {title ? (
        <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
          <h2 className="text-sm font-semibold text-neutral-900">{title}</h2>
          {action}
        </div>
      ) : null}
      <div className="p-4">{children}</div>
    </section>
  );
}

type AdminMetricCardProps = {
  label: string;
  value: string;
  hint?: string;
};

export function AdminMetricCard({ label, value, hint }: AdminMetricCardProps) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-neutral-900">{value}</p>
      {hint ? <p className="mt-1 text-xs text-neutral-500">{hint}</p> : null}
    </div>
  );
}

export function AdminEmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-neutral-200 bg-neutral-50 px-6 py-12 text-center">
      <h3 className="text-sm font-medium text-neutral-900">{title}</h3>
      {description ? (
        <p className="mt-1 max-w-sm text-sm text-neutral-500">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
