"use client";

import { useMemo, useState, useTransition } from "react";
import {
  ArrowDown,
  ArrowUp,
  ImagePlus,
  Star,
  Trash2,
} from "lucide-react";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { CoverImage } from "@/components/ui/CoverImage";
import { CoverImageFrame } from "@/components/ui/CoverImageFrame";
import { AdminCard } from "@/components/admin/ui/AdminPageHeader";
import { MediaPickerDialog } from "@/components/admin/media/MediaPickerDialog";
import { MediaUploadButton } from "@/components/admin/media/MediaUploadButton";
import type { AdminMediaItem, ProductGalleryImage } from "@/types/admin-media";

type MediaGalleryPickerProps = {
  images: ProductGalleryImage[];
  onChange: (images: ProductGalleryImage[]) => void;
  onSave?: () => Promise<void>;
  isSaving?: boolean;
  saveMessage?: string | null;
  title?: string;
  showPrimarySection?: boolean;
};

function normalizePrimary(images: ProductGalleryImage[]): ProductGalleryImage[] {
  if (images.length === 0) {
    return images;
  }

  const primaryIndex = images.findIndex((image) => image.isPrimary);
  if (primaryIndex >= 0) {
    return images.map((image, index) => ({
      ...image,
      isPrimary: index === primaryIndex,
      sortOrder: index,
    }));
  }

  return images.map((image, index) => ({
    ...image,
    isPrimary: index === 0,
    sortOrder: index,
  }));
}

function toGalleryImage(
  item: AdminMediaItem,
  isPrimary: boolean,
  sortOrder: number,
): ProductGalleryImage {
  return {
    mediaId: item.id,
    url: item.url,
    filename: item.originalName,
    alt: item.alt ?? undefined,
    isPrimary,
    sortOrder,
  };
}

export function MediaGalleryPicker({
  images,
  onChange,
  onSave,
  isSaving = false,
  saveMessage,
  title = "Фотографии товара",
  showPrimarySection = true,
}: MediaGalleryPickerProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const primaryImage = useMemo(
    () => images.find((image) => image.isPrimary) ?? images[0] ?? null,
    [images],
  );

  function updateImages(next: ProductGalleryImage[]) {
    onChange(normalizePrimary(next));
  }

  function handleReplace(index: number, item: AdminMediaItem) {
    setUploadError(null);
    updateImages(
      images.map((image, currentIndex) =>
        currentIndex === index
          ? toGalleryImage(item, image.isPrimary, image.sortOrder)
          : image,
      ),
    );
  }

  function handleAdd(item: AdminMediaItem) {
    setUploadError(null);

    if (replaceIndex !== null) {
      handleReplace(replaceIndex, item);
      setReplaceIndex(null);
      return;
    }

    updateImages([
      ...images,
      toGalleryImage(item, images.length === 0, images.length),
    ]);
  }

  function handleAddPrimary(item: AdminMediaItem) {
    setUploadError(null);
    const newImage = toGalleryImage(item, true, images.length);
    if (images.length === 0) {
      updateImages([newImage]);
      return;
    }

    updateImages([
      ...images.map((image) => ({ ...image, isPrimary: false })),
      newImage,
    ]);
  }

  function handleRemove(index: number) {
    updateImages(images.filter((_, currentIndex) => currentIndex !== index));
  }

  function handleSetPrimary(index: number) {
    updateImages(
      images.map((image, currentIndex) => ({
        ...image,
        isPrimary: currentIndex === index,
      })),
    );
  }

  function moveImage(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= images.length) {
      return;
    }

    const next = [...images];
    const [moved] = next.splice(index, 1);
    if (!moved) {
      return;
    }
    next.splice(targetIndex, 0, moved);
    updateImages(next);
  }

  function openReplaceLibrary(index: number) {
    setReplaceIndex(index);
    setDialogOpen(true);
  }

  function openAddLibrary() {
    setReplaceIndex(null);
    setDialogOpen(true);
  }

  function handleSave() {
    if (!onSave) {
      return;
    }

    startTransition(async () => {
      await onSave();
    });
  }

  return (
    <AdminCard title={title}>
      <div className="space-y-6">
        {showPrimarySection ? (
        <div>
          <p className="mb-3 text-sm font-medium text-neutral-800">Главное фото</p>
          {primaryImage ? (
            <CoverImageFrame className="aspect-square max-w-xs rounded-lg border border-neutral-200 bg-neutral-100">
              <CoverImage
                alt={primaryImage.alt ?? primaryImage.filename}
                sizes="240px"
                src={primaryImage.url}
              />
            </CoverImageFrame>
          ) : (
            <div className="flex aspect-square w-full max-w-xs items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-neutral-50 text-sm text-neutral-500">
              Главное фото не выбрано
            </div>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            <MediaUploadButton
              label="Загрузить фото"
              onError={setUploadError}
              onUploaded={handleAddPrimary}
            />
            <AdminButton
              onClick={openAddLibrary}
              size="sm"
              type="button"
              variant="secondary"
            >
              Выбрать из Media
            </AdminButton>
          </div>
        </div>
        ) : null}

        <div>
          <p className="mb-3 text-sm font-medium text-neutral-800">Галерея</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {images.map((image, index) => (
              <div
                className="overflow-hidden rounded-lg border border-neutral-200 bg-white"
                key={`${image.mediaId}-${index}`}
              >
                <CoverImageFrame className="aspect-square bg-neutral-100">
                  <CoverImage
                    alt={image.alt ?? image.filename}
                    sizes="160px"
                    src={image.url}
                  />
                  {image.isPrimary ? (
                    <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-neutral-800">
                      <Star className="h-3 w-3 fill-current" />
                      Main
                    </span>
                  ) : null}
                </CoverImageFrame>
                <div className="space-y-2 p-2.5">
                  <p className="truncate text-xs font-medium text-neutral-800">
                    {image.filename}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <MediaUploadButton
                      label="Заменить"
                      onError={setUploadError}
                      onUploaded={(item) => handleReplace(index, item)}
                    />
                    <AdminButton
                      onClick={() => openReplaceLibrary(index)}
                      size="sm"
                      type="button"
                      variant="secondary"
                    >
                      Из Media
                    </AdminButton>
                    {!image.isPrimary ? (
                      <AdminButton
                        onClick={() => handleSetPrimary(index)}
                        size="sm"
                        type="button"
                        variant="secondary"
                      >
                        Главное
                      </AdminButton>
                    ) : null}
                    <AdminButton
                      onClick={() => handleRemove(index)}
                      size="sm"
                      type="button"
                      variant="danger"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </AdminButton>
                  </div>
                  <div className="flex gap-1">
                    <AdminButton
                      disabled={index === 0}
                      onClick={() => moveImage(index, -1)}
                      size="sm"
                      type="button"
                      variant="secondary"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </AdminButton>
                    <AdminButton
                      disabled={index === images.length - 1}
                      onClick={() => moveImage(index, 1)}
                      size="sm"
                      type="button"
                      variant="secondary"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </AdminButton>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-3 text-sm text-neutral-600">
              <ImagePlus className="h-6 w-6" strokeWidth={1.5} />
              <MediaUploadButton
                label="+ Добавить фото"
                onError={setUploadError}
                onUploaded={handleAdd}
              />
              <AdminButton
                onClick={openAddLibrary}
                size="sm"
                type="button"
                variant="secondary"
              >
                Выбрать из Media
              </AdminButton>
            </div>
          </div>
        </div>

        {uploadError ? (
          <p className="text-sm text-rose-600">{uploadError}</p>
        ) : null}

        {onSave ? (
          <div className="flex flex-wrap items-center gap-3">
            <AdminButton
              disabled={isPending || isSaving}
              onClick={handleSave}
              type="button"
            >
              {isPending || isSaving ? "Сохранение..." : "Сохранить фотографии"}
            </AdminButton>
            {saveMessage ? (
              <p className="text-sm text-neutral-600">{saveMessage}</p>
            ) : null}
          </div>
        ) : null}
      </div>

      <MediaPickerDialog
        onClose={() => {
          setDialogOpen(false);
          setReplaceIndex(null);
        }}
        onSelect={handleAdd}
        open={dialogOpen}
        selectedId={
          replaceIndex !== null ? images[replaceIndex]?.mediaId ?? null : null
        }
        title={replaceIndex !== null ? "Заменить изображение" : "Добавить изображение"}
      />
    </AdminCard>
  );
}
