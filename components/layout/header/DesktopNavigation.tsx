import Link from "next/link";
import { headerNavigation } from "@/lib/config/navigation";
import { cn } from "@/lib/utils/cn";

type DesktopNavigationProps = {
  className?: string;
  onNavigate?: () => void;
};

export function DesktopNavigation({
  className,
  onNavigate,
}: DesktopNavigationProps) {
  return (
    <nav aria-label="Основная навигация" className={cn(className)}>
      <ul className="flex items-center gap-6 xl:gap-8">
        {headerNavigation.map((item) => (
          <li key={item.href}>
            <Link
              className="whitespace-nowrap text-[0.8125rem] font-medium tracking-[0.02em] text-foreground/85 transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              href={item.href}
              onClick={onNavigate}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
