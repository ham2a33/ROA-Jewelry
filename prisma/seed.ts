import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to run the seed.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const homepageCategories = [
  {
    name: "Кольца",
    slug: "koltsa",
    description: "Кольца из серебра 925 пробы",
    sortOrder: 1,
  },
  {
    name: "Серьги",
    slug: "sergi",
    description: "Серьги из серебра 925 пробы",
    sortOrder: 2,
  },
  {
    name: "Подвески",
    slug: "podveski",
    description: "Подвески и кулоны из серебра 925 пробы",
    sortOrder: 3,
  },
  {
    name: "Браслеты",
    slug: "braslety",
    description: "Браслеты из серебра 925 пробы",
    sortOrder: 4,
  },
  {
    name: "Цепочки",
    slug: "tsepochki",
    description: "Цепочки из серебра 925 пробы",
    sortOrder: 5,
  },
  {
    name: "Мужские украшения",
    slug: "muzhskie-ukrasheniya",
    description: "Украшения для него из серебра 925 пробы",
    sortOrder: 6,
  },
] as const;

const productSeedData = [
  {
    name: "Печатка ROA",
    slug: "pechatka-roa",
    sku: "ROA-RNG-001",
    categorySlug: "koltsa",
    price: "45900",
    compareAtPrice: "52900",
    stock: 12,
    material: "Серебро 925",
    hallmark: "925",
    weightGrams: "8.4",
    isNew: false,
    isBestseller: true,
    isFeatured: true,
  },
  {
    name: "Кулон Compass",
    slug: "kulon-compass",
    sku: "ROA-PND-002",
    categorySlug: "podveski",
    price: "38900",
    compareAtPrice: null,
    stock: 18,
    material: "Серебро 925",
    hallmark: "925",
    weightGrams: "6.2",
    isNew: true,
    isBestseller: true,
    isFeatured: false,
  },
  {
    name: "Браслет Royal",
    slug: "braslet-royal",
    sku: "ROA-BRC-003",
    categorySlug: "braslety",
    price: "62900",
    compareAtPrice: "69900",
    stock: 9,
    material: "Серебро 925",
    hallmark: "925",
    weightGrams: "14.8",
    isNew: false,
    isBestseller: true,
    isFeatured: true,
  },
  {
    name: "Серьги Grace",
    slug: "sergi-grace",
    sku: "ROA-EAR-004",
    categorySlug: "sergi",
    price: "34900",
    compareAtPrice: null,
    stock: 15,
    material: "Серебро 925",
    hallmark: "925",
    weightGrams: "5.1",
    isNew: true,
    isBestseller: true,
    isFeatured: false,
  },
  {
    name: "Кольцо Aura",
    slug: "koltso-aura",
    sku: "ROA-RNG-005",
    categorySlug: "koltsa",
    price: "41900",
    compareAtPrice: null,
    stock: 11,
    material: "Серебро 925",
    hallmark: "925",
    weightGrams: "7.3",
    isNew: false,
    isBestseller: false,
    isFeatured: true,
  },
  {
    name: "Цепочка Essential",
    slug: "tsepochka-essential",
    sku: "ROA-CHN-006",
    categorySlug: "tsepochki",
    price: "55900",
    compareAtPrice: "61900",
    stock: 7,
    material: "Серебро 925",
    hallmark: "925",
    weightGrams: "18.6",
    isNew: false,
    isBestseller: true,
    isFeatured: false,
  },
  {
    name: "Серьги Line",
    slug: "sergi-line",
    sku: "ROA-EAR-007",
    categorySlug: "sergi",
    price: "29900",
    compareAtPrice: null,
    stock: 0,
    material: "Серебро 925",
    hallmark: "925",
    weightGrams: "4.4",
    isNew: false,
    isBestseller: true,
    isFeatured: false,
  },
  {
    name: "Кулон Signature",
    slug: "kulon-signature",
    sku: "ROA-PND-008",
    categorySlug: "podveski",
    price: "47900",
    compareAtPrice: "54900",
    stock: 10,
    material: "Серебро 925",
    hallmark: "925",
    weightGrams: "7.9",
    isNew: true,
    isBestseller: false,
    isFeatured: true,
  },
  {
    name: "Кольцо Nova",
    slug: "koltso-nova",
    sku: "ROA-RNG-009",
    categorySlug: "koltsa",
    price: "36900",
    compareAtPrice: null,
    stock: 14,
    material: "Серебро 925",
    hallmark: "925",
    weightGrams: "6.8",
    isNew: true,
    isBestseller: false,
    isFeatured: false,
  },
] as const;

const bestsellerProductSlugs = [
  "pechatka-roa",
  "kulon-compass",
  "braslet-royal",
  "sergi-grace",
] as const;

const newArrivalProductSlugs = [
  "kulon-compass",
  "sergi-grace",
  "kulon-signature",
  "koltso-nova",
] as const;

async function seedHeroSection(): Promise<void> {
  await prisma.homepageSection.upsert({
    where: { key: "homepage_promo_banner" },
    update: {},
    create: {
      key: "homepage_promo_banner",
      type: "HERO",
      title: "Главная — баннер",
      subtitle: "Серебро 925 пробы • Изысканный дизайн • Для неё и для него",
      buttonText: "Смотреть коллекцию",
      buttonUrl: "/catalog",
      isActive: true,
      sortOrder: 0,
      settings: {
        overline: "ROA Jewelry",
      },
    },
  });
}

async function seedCategories(): Promise<void> {
  for (const category of homepageCategories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        sortOrder: category.sortOrder,
        isActive: true,
      },
      create: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        sortOrder: category.sortOrder,
        isActive: true,
      },
    });
  }
}

async function seedProducts(): Promise<Map<string, string>> {
  const productIds = new Map<string, string>();

  for (const product of productSeedData) {
    const category = await prisma.category.findUnique({
      where: { slug: product.categorySlug },
      select: { id: true },
    });

    if (!category) {
      throw new Error(`Category not found for product: ${product.slug}`);
    }

    const record = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        sku: product.sku,
        categoryId: category.id,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        stock: product.stock,
        material: product.material,
        hallmark: product.hallmark,
        weightGrams: product.weightGrams,
        isNew: product.isNew,
        isBestseller: product.isBestseller,
        isFeatured: product.isFeatured,
        isActive: true,
      },
      create: {
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        categoryId: category.id,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        stock: product.stock,
        material: product.material,
        hallmark: product.hallmark,
        weightGrams: product.weightGrams,
        isNew: product.isNew,
        isBestseller: product.isBestseller,
        isFeatured: product.isFeatured,
        isActive: true,
      },
      select: { id: true, slug: true },
    });

    productIds.set(record.slug, record.id);
  }

  return productIds;
}

async function seedHomepageSectionItems(
  sectionId: string,
  productIds: Map<string, string>,
  slugs: readonly string[],
): Promise<void> {
  for (const [index, slug] of slugs.entries()) {
    const productId = productIds.get(slug);
    if (!productId) {
      continue;
    }

    const existingItem = await prisma.homepageSectionItem.findFirst({
      where: {
        sectionId,
        productId,
      },
      select: { id: true },
    });

    if (existingItem) {
      await prisma.homepageSectionItem.update({
        where: { id: existingItem.id },
        data: {
          sortOrder: index + 1,
          isActive: true,
        },
      });
      continue;
    }

    await prisma.homepageSectionItem.create({
      data: {
        sectionId,
        productId,
        sortOrder: index + 1,
        isActive: true,
      },
    });
  }
}

async function seedBestsellersSection(
  productIds: Map<string, string>,
): Promise<void> {
  const section = await prisma.homepageSection.upsert({
    where: { key: "bestsellers" },
    update: {
      title: "Хиты продаж",
      subtitle: "Украшения, которые выбирают чаще всего",
      isActive: true,
    },
    create: {
      key: "bestsellers",
      type: "BESTSELLERS",
      title: "Хиты продаж",
      subtitle: "Украшения, которые выбирают чаще всего",
      isActive: true,
      sortOrder: 2,
    },
  });

  await seedHomepageSectionItems(section.id, productIds, bestsellerProductSlugs);
}

async function seedNewArrivalsSection(
  productIds: Map<string, string>,
): Promise<void> {
  const section = await prisma.homepageSection.upsert({
    where: { key: "new-arrivals" },
    update: {
      title: "Новинки",
      subtitle: "Свежие украшения из коллекции ROA",
      isActive: true,
    },
    create: {
      key: "new-arrivals",
      type: "NEW_ARRIVALS",
      title: "Новинки",
      subtitle: "Свежие украшения из коллекции ROA",
      isActive: true,
      sortOrder: 3,
      settings: {
        limit: 4,
      },
    },
  });

  await seedHomepageSectionItems(section.id, productIds, newArrivalProductSlugs);
}

const benefitsSettings = {
  items: [
    {
      id: "benefit-quality",
      title: "Премиальное качество",
      description: "Внимание к каждой детали украшения.",
      icon: "Sparkles",
      sortOrder: 1,
      isActive: true,
    },
    {
      id: "benefit-silver",
      title: "Серебро 925 пробы",
      description: "Украшения из качественного серебра.",
      icon: "Gem",
      sortOrder: 2,
      isActive: true,
    },
    {
      id: "benefit-delivery",
      title: "Доставка по Казахстану",
      description: "Удобная доставка по городам Казахстана.",
      icon: "Truck",
      sortOrder: 3,
      isActive: true,
    },
    {
      id: "benefit-care",
      title: "Забота о клиентах",
      description: "Помогаем выбрать украшение и отвечаем на вопросы.",
      icon: "Heart",
      sortOrder: 4,
      isActive: true,
    },
  ],
} as const;

async function seedBenefitsSection(): Promise<void> {
  await prisma.homepageSection.upsert({
    where: { key: "benefits" },
    update: {
      title: "Почему ROA",
      subtitle: null,
      isActive: true,
      settings: benefitsSettings,
    },
    create: {
      key: "benefits",
      type: "BENEFITS",
      title: "Почему ROA",
      isActive: true,
      sortOrder: 4,
      settings: benefitsSettings,
    },
  });
}

async function seedAboutSection(): Promise<void> {
  await prisma.homepageSection.upsert({
    where: { key: "about" },
    update: {
      title: "Украшения, созданные оставаться с вами",
      description:
        "ROA Jewelry — это серебро 925 пробы, спокойная эстетика и внимание к каждой детали. Мы создаём украшения для повседневной жизни и особых моментов.",
      buttonText: "Узнать больше",
      buttonUrl: "/about",
      isActive: true,
      settings: {
        overline: "ROA Jewelry",
        imagePosition: "left",
      },
    },
    create: {
      key: "about",
      type: "ABOUT",
      title: "Украшения, созданные оставаться с вами",
      description:
        "ROA Jewelry — это серебро 925 пробы, спокойная эстетика и внимание к каждой детали. Мы создаём украшения для повседневной жизни и особых моментов.",
      buttonText: "Узнать больше",
      buttonUrl: "/about",
      isActive: true,
      sortOrder: 5,
      settings: {
        overline: "ROA Jewelry",
        imagePosition: "left",
      },
    },
  });
}

async function seedFinalCtaSection(): Promise<void> {
  await prisma.homepageSection.upsert({
    where: { key: "final-cta" },
    update: {
      title: "Найдите украшение, которое станет вашим",
      description:
        "Серебряные украшения ROA для тех, кто ценит детали.",
      buttonText: "Смотреть каталог",
      buttonUrl: "/catalog",
      isActive: true,
      settings: {
        overline: "ROA JEWELRY",
        overlay: 0.25,
      },
    },
    create: {
      key: "final-cta",
      type: "FINAL_CTA",
      title: "Найдите украшение, которое станет вашим",
      description:
        "Серебряные украшения ROA для тех, кто ценит детали.",
      buttonText: "Смотреть каталог",
      buttonUrl: "/catalog",
      isActive: true,
      sortOrder: 6,
      settings: {
        overline: "ROA JEWELRY",
        overlay: 0.25,
      },
    },
  });
}

async function main(): Promise<void> {
  await seedHeroSection();
  await seedCategories();
  const productIds = await seedProducts();
  await seedBestsellersSection(productIds);
  await seedNewArrivalsSection(productIds);
  await seedBenefitsSection();
  await seedAboutSection();
  await seedFinalCtaSection();
  console.log(
    "Seed completed: hero, categories, products, bestsellers, new arrivals, benefits, about, and final CTA ready (no images).",
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
