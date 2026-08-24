import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { MediaLibrary } from "@/components/admin/media/MediaLibrary";
import { AdminPagination } from "@/components/admin/ui/AdminPagination";
import { requirePermission } from "@/lib/auth/guards";
import { siteConfig } from "@/lib/config/site-config";
import { getAdminMedia } from "@/server/queries/admin/media";

type PageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function AdminMediaPage({ searchParams }: PageProps) {
  await requirePermission("media.manage");
  const params = await searchParams;
  const data = await getAdminMedia({
    page: Number(params.page ?? "1"),
    limit: Number(params.limit ?? "20"),
    search: params.search,
    kind: params.kind === "images" ? "IMAGE" : "ALL",
  });

  return (
    <div>
      <AdminPageHeader title="Media" description="Библиотека медиафайлов" />
      <form className="mb-4 flex gap-2">
        <input
          name="search"
          defaultValue={params.search ?? ""}
          placeholder="Поиск по filename"
          className="h-9 rounded-md border border-neutral-200 px-3 text-sm"
        />
        <select
          name="kind"
          defaultValue={params.kind ?? "all"}
          className="h-9 rounded-md border border-neutral-200 px-3 text-sm"
        >
          <option value="all">All</option>
          <option value="images">Images</option>
        </select>
        <button
          type="submit"
          className="h-9 rounded-md bg-neutral-900 px-4 text-sm text-white"
        >
          Filter
        </button>
      </form>
      <MediaLibrary items={data.items} />
      <AdminPagination
        page={data.page}
        totalPages={data.totalPages}
        basePath={siteConfig.routes.admin.media}
        searchParams={params}
      />
    </div>
  );
}
