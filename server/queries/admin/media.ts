import "server-only";

import { prisma } from "@/lib/db";
import { DEFAULT_ADMIN_PAGE_SIZE } from "@/lib/admin/constants";
import { getHomepageSectionDisplayName } from "@/lib/homepage/image-slots";
import { requireRuntimeAccess } from "@/server/queries/runtime-access";

export type MediaUsage = {
  products: string[];
  categories: string[];
  homepageSections: string[];
  homepageSectionItems: string[];
  reviews: string[];
  siteSettings: string[];
  banners: string[];
  variants: string[];
};

export async function getAdminMedia(query?: {
  page?: number;
  limit?: number;
  search?: string;
  kind?: "IMAGE" | "ALL";
}) {
  await requireRuntimeAccess();
  const page = Math.max(1, query?.page ?? 1);
  const limit = query?.limit ?? DEFAULT_ADMIN_PAGE_SIZE;
  const where = {
    ...(query?.kind === "IMAGE" ? { kind: "IMAGE" as const } : {}),
    ...(query?.search?.trim()
      ? {
          OR: [
            {
              filename: {
                contains: query.search.trim(),
                mode: "insensitive" as const,
              },
            },
            {
              originalName: {
                contains: query.search.trim(),
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
  };

  const skip = (page - 1) * limit;

  const [total, rows] = await Promise.all([
    prisma.media.count({ where }),
    prisma.media.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
  ]);

  return {
    items: rows,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function getMediaUsage(mediaId: string): Promise<MediaUsage> {
  await requireRuntimeAccess();
  const [
    productImages,
    categories,
    homepageSections,
    homepageSectionItems,
    reviewImages,
    siteSettings,
    banners,
    variants,
  ] = await Promise.all([
    prisma.productImage.findMany({
      where: { mediaId },
      include: { product: { select: { name: true } } },
    }),
    prisma.category.findMany({
      where: { imageId: mediaId },
      select: { name: true },
    }),
    prisma.homepageSection.findMany({
      where: {
        OR: [{ imageId: mediaId }, { mobileImageId: mediaId }],
      },
      select: { key: true, title: true },
    }),
    prisma.homepageSectionItem.findMany({
      where: { mediaId },
      include: {
        section: { select: { key: true, title: true } },
      },
    }),
    prisma.reviewImage.findMany({
      where: { mediaId },
      include: { review: { select: { authorName: true } } },
    }),
    prisma.siteSettings.findMany({
      where: {
        OR: [
          { logoId: mediaId },
          { faviconId: mediaId },
          { defaultOgImageId: mediaId },
        ],
      },
      select: { id: true },
    }),
    prisma.banner.findMany({
      where: {
        OR: [{ imageId: mediaId }, { mobileImageId: mediaId }],
      },
      select: { title: true },
    }),
    prisma.productVariant.findMany({
      where: { imageId: mediaId },
      include: { product: { select: { name: true } } },
    }),
  ]);

  return {
    products: productImages.map((item) => item.product.name),
    categories: categories.map((item) => item.name),
    homepageSections: homepageSections.map((item) =>
      getHomepageSectionDisplayName(item.key, item.title),
    ),
    homepageSectionItems: homepageSectionItems.map(
      (item) => item.section.title ?? item.section.key,
    ),
    reviews: reviewImages.map((item) => item.review.authorName),
    siteSettings: siteSettings.length > 0 ? ["Настройки сайта"] : [],
    banners: banners.map((item) => item.title ?? "Баннер"),
    variants: variants.map(
      (item) => `${item.product.name} (вариант)`,
    ),
  };
}

export function formatMediaUsage(usage: MediaUsage): string[] {
  const lines: string[] = [];
  for (const name of usage.products) {
    lines.push(`Товар: ${name}`);
  }
  for (const name of usage.categories) {
    lines.push(`Категория: ${name}`);
  }
  for (const name of usage.homepageSections) {
    lines.push(`Главная: ${name}`);
  }
  for (const name of usage.homepageSectionItems) {
    lines.push(`Главная (элемент): ${name}`);
  }
  for (const name of usage.reviews) {
    lines.push(`Отзыв: ${name}`);
  }
  for (const name of usage.banners) {
    lines.push(`Баннер: ${name}`);
  }
  for (const name of usage.variants) {
    lines.push(`Вариант: ${name}`);
  }
  lines.push(...usage.siteSettings);
  return lines;
}
