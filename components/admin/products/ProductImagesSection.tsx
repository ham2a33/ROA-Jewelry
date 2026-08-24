"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { MediaGalleryPicker } from "@/components/admin/media/MediaGalleryPicker";
import { syncProductImages } from "@/server/actions/admin/products";
import type { ProductGalleryImage } from "@/types/admin-media";

type ProductImagesSectionProps = {
  productId: string;
  initialImages: ProductGalleryImage[];
};

export function ProductImagesSection({
  productId,
  initialImages,
}: ProductImagesSectionProps) {
  const router = useRouter();
  const [images, setImages] = useState(initialImages);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSave() {
    return new Promise<void>((resolve) => {
      startTransition(async () => {
        const result = await syncProductImages({
          productId,
          images: images.map((image, index) => ({
            mediaId: image.mediaId,
            alt: image.alt,
            isPrimary: image.isPrimary,
            sortOrder: index,
          })),
        });

        setMessage(
          result.success ? "Фотографии сохранены" : result.message,
        );
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
    />
  );
}
