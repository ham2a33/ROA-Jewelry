import { AdminEmptyState, AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { AdminPagination } from "@/components/admin/ui/AdminPagination";
import { ReviewActions } from "@/components/admin/reviews/ReviewActions";
import { ReviewImagesSection } from "@/components/admin/reviews/ReviewImagesSection";
import { requirePermission } from "@/lib/auth/guards";
import { siteConfig } from "@/lib/config/site-config";
import { getAdminReviews } from "@/server/queries/admin/reviews";

type PageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function AdminReviewsPage({ searchParams }: PageProps) {
  await requirePermission("reviews.manage");
  const params = await searchParams;
  const data = await getAdminReviews({
    page: Number(params.page ?? "1"),
    limit: Number(params.limit ?? "20"),
    status: params.status as "published" | "hidden" | "all" | undefined,
  });

  return (
    <div>
      <AdminPageHeader title="Reviews" />
      <form className="mb-4">
        <select
          name="status"
          defaultValue={params.status ?? "all"}
          className="h-9 rounded-md border border-neutral-200 px-3 text-sm"
        >
          <option value="all">All</option>
          <option value="published">Published</option>
          <option value="hidden">Hidden</option>
        </select>
      </form>

      {data.items.length === 0 ? (
        <AdminEmptyState title="Отзывов пока нет." />
      ) : (
        <div className="space-y-4">
          {data.items.map((review) => (
            <article
              key={review.id}
              className="rounded-lg border border-neutral-200 bg-white p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{review.authorName}</p>
                  <p className="text-sm text-neutral-500">
                    {review.product?.name ?? "Без товара"} · {review.rating}/5
                  </p>
                </div>
                <ReviewActions
                  id={review.id}
                  isApproved={review.isApproved}
                  isPublished={review.isPublished}
                />
              </div>
              {review.title ? (
                <p className="mt-2 font-medium">{review.title}</p>
              ) : null}
              <p className="mt-2 text-sm text-neutral-700">{review.body}</p>
              <div className="mt-4">
                <ReviewImagesSection
                  reviewId={review.id}
                  initialImages={review.images.map((image) => ({
                    mediaId: image.mediaId,
                    url: image.media.url,
                    filename: image.media.originalName,
                    alt: undefined,
                    isPrimary: false,
                    sortOrder: image.sortOrder,
                  }))}
                />
              </div>
            </article>
          ))}
        </div>
      )}

      <AdminPagination
        page={data.page}
        totalPages={data.totalPages}
        basePath={siteConfig.routes.admin.reviews}
        searchParams={params}
      />
    </div>
  );
}
