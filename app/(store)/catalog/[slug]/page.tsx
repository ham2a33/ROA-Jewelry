import { redirect } from "next/navigation";
import { buildCategoryUrl } from "@/lib/catalog/url";

type CatalogCategoryRedirectPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CatalogCategoryRedirectPage({
  params,
}: CatalogCategoryRedirectPageProps) {
  const { slug } = await params;
  redirect(buildCategoryUrl(slug));
}
