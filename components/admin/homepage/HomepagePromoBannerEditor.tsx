"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { siteConfig } from "@/lib/config/site-config";
import { HOMEPAGE_PROMO_BANNER_SLOT } from "@/lib/homepage/image-slots";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { AdminCard } from "@/components/admin/ui/AdminPageHeader";
import { MediaPickerField } from "@/components/admin/media/MediaPickerField";
import { updateHomepagePromoBannerImages } from "@/server/actions/admin/homepage-promo-banner";
import type { AdminMediaPickerValue } from "@/types/admin-media";

type HomepagePromoBannerEditorProps = {
  sectionId: string;
  image: AdminMediaPickerValue;
  mobileImage: AdminMediaPickerValue;
};

export function HomepagePromoBannerEditor({
  sectionId,
  image: initialImage,
  mobileImage: initialMobileImage,
}: HomepagePromoBannerEditorProps) {
  const router = useRouter();
  const [image, setImage] = useState(initialImage);
  const [mobileImage, setMobileImage] = useState(initialMobileImage);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function persist(nextImage: AdminMediaPickerValue, nextMobileImage: AdminMediaPickerValue) {
    startTransition(async () => {
      const result = await updateHomepagePromoBannerImages({
        sectionId,
        imageId: nextImage?.id ?? null,
        mobileImageId: nextMobileImage?.id ?? null,
      });

      setMessage(result.success ? "Баннер сохранён" : result.message);
      if (result.success) {
        router.refresh();
      }
    });
  }

  function handleImageChange(nextImage: AdminMediaPickerValue) {
    setImage(nextImage);
    persist(nextImage, mobileImage);
  }

  function handleMobileImageChange(nextMobileImage: AdminMediaPickerValue) {
    setMobileImage(nextMobileImage);
    persist(image, nextMobileImage);
  }

  return (
    <AdminCard title={HOMEPAGE_PROMO_BANNER_SLOT.label}>
      <p className="mb-6 text-sm text-neutral-600">
        Компактный баннер в верхней части главной страницы. Изображение
        автоматически подстраивается под блок без изменения его размеров.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <MediaPickerField
          aspectClassName="aspect-[21/9] max-h-40"
          helperText="Основное изображение баннера на десктопе."
          label="Фотография баннера"
          libraryLabel="Выбрать из Media"
          onChange={handleImageChange}
          uploadLabel="Загрузить фото"
          value={image}
        />
        <MediaPickerField
          allowRemove
          aspectClassName="aspect-[21/9] max-h-40"
          helperText="Необязательно. Если не задано, используется основное."
          label="Мобильная фотография"
          libraryLabel="Выбрать из Media"
          onChange={handleMobileImageChange}
          uploadLabel="Загрузить фото"
          value={mobileImage}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <a href={siteConfig.routes.home} rel="noreferrer" target="_blank">
          <AdminButton disabled={isPending} type="button" variant="secondary">
            Открыть главную
          </AdminButton>
        </a>
        {message ? <p className="text-sm text-neutral-600">{message}</p> : null}
      </div>
    </AdminCard>
  );
}
