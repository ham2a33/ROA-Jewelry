import { HomepageBanner } from "@/components/store/home/HomepageBanner";
import { CategoriesSection } from "@/components/store/home/CategoriesSection";
import { BestsellersSection } from "@/components/store/home/BestsellersSection";
import { NewArrivalsSection } from "@/components/store/home/NewArrivalsSection";
import { BenefitsSection } from "@/components/store/home/BenefitsSection";
import { AboutSection } from "@/components/store/home/AboutSection";
import { FinalCtaSection } from "@/components/store/home/FinalCtaSection";
import { getHomepageCategories } from "@/server/queries/categories";
import {
  getAboutSection,
  getBenefitsSection,
  getBestsellersSection,
  getFinalCtaSection,
  getNewArrivalsSection,
} from "@/server/queries/homepage";

export default async function HomePage() {
  const [categories, bestsellers, newArrivals, benefits, about, finalCta] =
    await Promise.all([
      getHomepageCategories(),
      getBestsellersSection(),
      getNewArrivalsSection(),
      getBenefitsSection(),
      getAboutSection(),
      getFinalCtaSection(),
    ]);

  return (
    <>
      <HomepageBanner />
      <CategoriesSection categories={categories} />
      <BestsellersSection section={bestsellers} />
      <NewArrivalsSection section={newArrivals} />
      <BenefitsSection section={benefits} />
      <AboutSection section={about} />
      <FinalCtaSection section={finalCta} />
    </>
  );
}
