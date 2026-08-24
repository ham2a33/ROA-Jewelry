import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { HomepageEditor } from "@/components/admin/homepage/HomepageEditor";
import { HomepagePromoBannerEditor } from "@/components/admin/homepage/HomepagePromoBannerEditor";
import { HOMEPAGE_PROMO_BANNER_SLOT } from "@/lib/homepage/image-slots";
import { requirePermission } from "@/lib/auth/guards";
import { getAdminHomepageSections } from "@/server/queries/admin/homepage";
import { getHomepagePromoBannerSectionForAdmin } from "@/server/queries/homepage-promo-banner";
import type { AdminMediaPickerValue } from "@/types/admin-media";

function toPickerValue(
  media: {
    id: string;
    url: string;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    alt: string | null;
  } | null,
): AdminMediaPickerValue {
  if (!media) {
    return null;
  }

  return {
    id: media.id,
    url: media.url,
    filename: media.filename,
    originalName: media.originalName,
    mimeType: media.mimeType,
    size: media.size,
    alt: media.alt,
  };
}

export default async function AdminHomepagePage() {
  await requirePermission("homepage.manage");
  const [promoBannerSection, sections] = await Promise.all([
    getHomepagePromoBannerSectionForAdmin(),
    getAdminHomepageSections(),
  ]);

  const otherSections = sections.filter(
    (section) => section.key !== HOMEPAGE_PROMO_BANNER_SLOT.key,
  );

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Homepage"
        description="Управление секциями главной страницы"
      />
      <HomepagePromoBannerEditor
        image={toPickerValue(promoBannerSection.image)}
        mobileImage={toPickerValue(promoBannerSection.mobileImage)}
        sectionId={promoBannerSection.id}
      />
      <HomepageEditor
        sections={otherSections.map((section) => ({
          id: section.id,
          key: section.key,
          type: section.type,
          title: section.title,
          subtitle: section.subtitle,
          description: section.description,
          buttonText: section.buttonText,
          buttonUrl: section.buttonUrl,
          isActive: section.isActive,
          sortOrder: section.sortOrder,
          image: toPickerValue(section.image),
          mobileImage: toPickerValue(section.mobileImage),
        }))}
      />
    </div>
  );
}
