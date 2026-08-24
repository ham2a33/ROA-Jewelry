"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Search } from "lucide-react";
import { siteConfig } from "@/lib/config/site-config";
import { AdminSidebar } from "./AdminSidebar";
import type { UserRole } from "@/lib/auth/roles";

type AdminShellProps = {
  children: React.ReactNode;
  userName: string;
  role: UserRole;
};

export function AdminShell({ children, userName, role }: AdminShellProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }

    startTransition(() => {
      if (/^ROA-\d+/i.test(trimmed)) {
        router.push(
          `${siteConfig.routes.admin.orders}?search=${encodeURIComponent(trimmed)}`,
        );
        return;
      }

      if (/^\+?\d[\d\s()-]{6,}$/.test(trimmed)) {
        router.push(
          `${siteConfig.routes.admin.customers}?search=${encodeURIComponent(trimmed)}`,
        );
        return;
      }

      router.push(
        `${siteConfig.routes.admin.products}?search=${encodeURIComponent(trimmed)}`,
      );
    });
  }

  return (
    <div className="admin-root min-h-screen bg-neutral-50 text-neutral-900">
      <div className="flex min-h-screen">
        <AdminSidebar role={role} userName={userName} />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur lg:pl-0">
            <div className="flex items-center gap-3 px-4 py-3 lg:px-6">
              <form onSubmit={handleSearch} className="relative ml-auto w-full max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Поиск заказов, товаров, клиентов..."
                  className="h-9 w-full rounded-md border border-neutral-200 bg-neutral-50 pl-9 pr-3 text-sm outline-none ring-neutral-900/10 focus:border-neutral-300 focus:ring-2"
                  disabled={isPending}
                />
              </form>
            </div>
          </header>
          <main className="flex-1 px-4 py-6 lg:px-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
