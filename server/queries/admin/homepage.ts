import "server-only";

import { prisma } from "@/lib/db";
import { requireRuntimeAccess } from "@/server/queries/runtime-access";

export async function getAdminHomepageSections() {
  await requireRuntimeAccess();
  return prisma.homepageSection.findMany({
    orderBy: [{ sortOrder: "asc" }, { key: "asc" }],
    include: {
      image: true,
      mobileImage: true,
      items: {
        orderBy: { sortOrder: "asc" },
        include: {
          product: { select: { id: true, name: true, slug: true } },
          category: { select: { id: true, name: true, slug: true } },
          media: true,
        },
      },
    },
  });
}

export async function getAdminHomepageSectionByKey(key: string) {
  await requireRuntimeAccess();
  return prisma.homepageSection.findUnique({
    where: { key },
    include: {
      image: true,
      mobileImage: true,
      items: {
        orderBy: { sortOrder: "asc" },
        include: {
          product: { select: { id: true, name: true, slug: true } },
          category: { select: { id: true, name: true, slug: true } },
          media: true,
        },
      },
    },
  });
}

export async function getAdminUsers() {
  await requireRuntimeAccess();
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
    },
  });
}

export async function getAdminUserById(id: string) {
  await requireRuntimeAccess();
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
    },
  });
}

export async function getAdminCollectionsSummary() {
  await requireRuntimeAccess();
  const [featured, bestsellers, newItems, sale] = await Promise.all([
    prisma.product.count({ where: { isFeatured: true, isActive: true } }),
    prisma.product.count({ where: { isBestseller: true, isActive: true } }),
    prisma.product.count({ where: { isNew: true, isActive: true } }),
    prisma.product.count({
      where: {
        isActive: true,
        compareAtPrice: { not: null },
      },
    }),
  ]);

  return { featured, bestsellers, newItems, sale };
}
