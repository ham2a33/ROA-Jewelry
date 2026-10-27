"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { MediaGalleryPicker } from "@/components/admin/media/MediaGalleryPicker";
import { runClientAction } from "@/lib/admin/client-action";
import { syncReviewImages } from "@/server/actions/admin/reviews";
import type { ProductGalleryImage } from "@/types/admin-media";

type ReviewImagesSectionProps = {
  reviewId: string;
  initialImages: ProductGalleryImage[];
};

export function ReviewImagesSection({
  reviewId,
  initialImages,
}: ReviewImagesSectionProps) {
  const router = useRouter();
  const [images, setImages] = useState(initialImages);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSave() {
    return new Promise<void>((resolve) => {
      startTransition(async () => {
        const actionResult = await runClientAction(() =>
          syncReviewImages({
            reviewId,
            images: images.map((image, index) => ({
              mediaId: image.mediaId,
              sortOrder: index,
            })),
          }),
        );
        if (!actionResult.ok) {
          setMessage(actionResult.message);
          resolve();
          return;
        }
        const result = actionResult.value;

        setMessage(result.success ? "Фото отзыва сохранены" : result.message);
        if (result.success) {
          router.refresh();
        }
        resolve();
      });
    });
  }

  return (
    <MediaGalleryPicker
      images={images}
      isSaving={isPending}
      onChange={setImages}
      onSave={handleSave}
      saveMessage={message}
      showPrimarySection={false}
      title="Фото отзыва"
    />
  );
}
