import Link from "next/link";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { siteConfig } from "@/lib/config/site-config";

export default function AdminEntityNotFound() {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center">
      <h2 className="text-lg font-semibold">Запись не найдена</h2>
      <p className="mt-2 text-sm text-neutral-500">
        Возможно, она была удалена или ссылка устарела.
      </p>
      <Link href={siteConfig.routes.admin.dashboard} className="mt-4 inline-block">
        <AdminButton variant="secondary">На dashboard</AdminButton>
      </Link>
    </div>
  );
}
