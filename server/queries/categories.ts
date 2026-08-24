import "server-only";

import { prisma } from "@/lib/db";
import { mapHomepageCategory } from "@/server/queries/mappers";
import type { HomepageCategory } from "@/types/category";

const categorySelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  image: {
    select: {
      id: true,
      url: true,
      alt: true,
      width: true,
      height: true,
      mimeType: true,
    },
  },
} as const;

export async function getHomepageCategories(): Promise<HomepageCategory[]> {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: categorySelect,
    });

    return categories.map(mapHomepageCategory);
  } catch (error) {
    console.error("[getHomepageCategories]", error);
    return [];
  }
}
