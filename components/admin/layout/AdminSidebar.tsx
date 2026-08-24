"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ExternalLink,
  FolderTree,
  Home,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  ShoppingBag,
  Star,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { siteConfig } from "@/lib/config/site-config";
import { cn } from "@/lib/utils/cn";
import type { Permission } from "@/lib/auth/permissions";
import { can } from "@/lib/auth/permissions";
import type { UserRole } from "@/lib/auth/roles";
import { logoutAdmin } from "@/server/actions/admin/auth";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: Permission;
  match?: (pathname: string) => boolean;
};

const navSections: Array<{ title: string; items: NavItem[] }> = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        href: siteConfig.routes.admin.dashboard,
        icon: LayoutDashboard,
        match: (pathname) => pathname === siteConfig.routes.admin.dashboard,
      },
    ],
  },
  {
    title: "Shop",
    items: [
      {
        label: "Orders",
        href: siteConfig.routes.admin.orders,
        icon: ShoppingBag,
        permission: "orders.manage",
      },
      {
        label: "Products",
        href: siteConfig.routes.admin.products,
        icon: Package,
        permission: "products.manage",
      },
      {
        label: "Categories",
        href: siteConfig.routes.admin.categories,
        icon: FolderTree,
        permission: "categories.manage",
      },
      {
        label: "Collections",
        href: siteConfig.routes.admin.collections,
        icon: Star,
        permission: "products.manage",
      },
    ],
  },
  {
    title: "Customers",
    items: [
      {
        label: "Customers",
        href: siteConfig.routes.admin.customers,
        icon: Users,
        permission: "customers.manage",
      },
      {
        label: "Reviews",
        href: siteConfig.routes.admin.reviews,
        icon: Star,
        permission: "reviews.manage",
      },
    ],
  },
  {
    title: "Content",
    items: [
      {
        label: "Homepage",
        href: siteConfig.routes.admin.homepage,
        icon: Home,
        permission: "homepage.manage",
      },
      {
        label: "Media",
        href: siteConfig.routes.admin.media,
        icon: ImageIcon,
        permission: "media.manage",
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        label: "Settings",
        href: siteConfig.routes.admin.settingsGeneral,
        icon: Settings,
        permission: "settings.manage",
        match: (pathname) => pathname.startsWith(siteConfig.routes.admin.settings),
      },
    ],
  },
  {
    title: "Administration",
    items: [
      {
        label: "Users",
        href: siteConfig.routes.admin.admins,
        icon: Users,
        permission: "admins.manage",
      },
      {
        label: "Profile",
        href: siteConfig.routes.admin.profile,
        icon: Users,
      },
    ],
  },
];

function isActive(pathname: string, item: NavItem): boolean {
  if (item.match) {
    return item.match(pathname);
  }
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

type AdminSidebarProps = {
  role: UserRole;
  userName: string;
};

export function AdminSidebar({ role, userName }: AdminSidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const visibleSections = navSections
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) => !item.permission || can(role, item.permission),
      ),
    }))
    .filter((section) => section.items.length > 0);

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="border-b border-neutral-200 px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
          ROA Admin
        </p>
        <p className="mt-1 truncate text-sm text-neutral-700">{userName}</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {visibleSections.map((section) => (
          <div key={section.title} className="mb-5">
            <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
              {section.title}
            </p>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(pathname, item);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-2.5 py-2 text-sm transition-colors",
                        active
                          ? "bg-neutral-900 text-white"
                          : "text-neutral-700 hover:bg-neutral-100",
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-neutral-200 px-3 py-4">
        <Link
          href={siteConfig.routes.home}
          target="_blank"
          className="mb-2 flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
        >
          <ExternalLink className="h-4 w-4" />
          View Store
        </Link>
        <form action={logoutAdmin}>
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-md border border-neutral-200 bg-white p-2 text-neutral-700 lg:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <aside className="hidden w-64 shrink-0 border-r border-neutral-200 bg-white lg:block">
        {sidebarContent}
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close menu overlay"
            onClick={() => setOpen(false)}
          />
          <aside className="relative h-full w-72 max-w-[85vw] bg-white shadow-xl">
            <button
              type="button"
              className="absolute right-3 top-3 rounded-md p-2 text-neutral-600"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      ) : null}
    </>
  );
}
