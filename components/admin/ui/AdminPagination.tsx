import Link from "next/link";
import { cn } from "@/lib/utils/cn";

type AdminPaginationProps = {
  page: number;
  totalPages: number;
  basePath: string;
  searchParams: Record<string, string | undefined>;
};

function buildHref(
  basePath: string,
  searchParams: Record<string, string | undefined>,
  page: number,
): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (value) {
      params.set(key, value);
    }
  }
  params.set("page", String(page));
  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function AdminPagination({
  page,
  totalPages,
  basePath,
  searchParams,
}: AdminPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center justify-between gap-4 pt-4">
      <p className="text-sm text-neutral-500">
        Страница {page} из {totalPages}
      </p>
      <div className="flex gap-2">
        <Link
          href={buildHref(basePath, searchParams, Math.max(1, page - 1))}
          aria-disabled={page <= 1}
          className={cn(
            "rounded-md border border-neutral-200 px-3 py-1.5 text-sm",
            page <= 1
              ? "pointer-events-none opacity-40"
              : "hover:bg-neutral-50",
          )}
        >
          Назад
        </Link>
        <Link
          href={buildHref(basePath, searchParams, Math.min(totalPages, page + 1))}
          aria-disabled={page >= totalPages}
          className={cn(
            "rounded-md border border-neutral-200 px-3 py-1.5 text-sm",
            page >= totalPages
              ? "pointer-events-none opacity-40"
              : "hover:bg-neutral-50",
          )}
        >
          Вперёд
        </Link>
      </div>
    </nav>
  );
}
