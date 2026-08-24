import Link from "next/link";
import { cn } from "@/lib/utils/cn";

type FooterColumnProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export function FooterColumn({ title, children, className }: FooterColumnProps) {
  return (
    <div className={cn("min-w-0", className)}>
      <h3 className="mb-4 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-foreground/75">
        {title}
      </h3>
      {children}
    </div>
  );
}

type FooterLinkListProps = {
  items: Array<{ label: string; href: string }>;
  className?: string;
};

export function FooterLinkList({ items, className }: FooterLinkListProps) {
  return (
    <ul className={cn("space-y-2.5", className)}>
      {items.map((item) => (
        <li key={item.href}>
          <Link
            className="inline-block text-sm text-foreground/75 transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-footer"
            href={item.href}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
