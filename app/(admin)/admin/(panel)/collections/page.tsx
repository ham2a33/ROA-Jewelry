import Link from "next/link";
import { AdminCard, AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { requirePermission } from "@/lib/auth/guards";
import { siteConfig } from "@/lib/config/site-config";
import { getAdminCollectionsSummary } from "@/server/queries/admin/homepage";

export default async function AdminCollectionsPage() {
  await requirePermission("products.manage");
  const summary = await getAdminCollectionsSummary();

  const items = [
    { label: "Featured", count: summary.featured, href: `${siteConfig.routes.admin.products}?featured=true` },
    { label: "Bestsellers", count: summary.bestsellers, href: `${siteConfig.routes.admin.products}?bestseller=true` },
    { label: "New", count: summary.newItems, href: `${siteConfig.routes.admin.products}?status=active` },
    { label: "Sale", count: summary.sale, href: siteConfig.routes.admin.products },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Collections"
        description="Управление подборками через product flags"
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <AdminCard key={item.label} title={item.label}>
            <p className="text-3xl font-semibold">{item.count}</p>
            <Link
              href={item.href}
              className="mt-3 inline-block text-sm text-neutral-700 hover:underline"
            >
              Manage products
            </Link>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}
