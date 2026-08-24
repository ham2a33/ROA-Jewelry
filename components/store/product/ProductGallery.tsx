"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useId, useState } from "react";
import {
  ProductGalleryMedia,
  ProductGallerySlot,
} from "@/components/store/product/ProductGalleryMedia";
import { cn } from "@/lib/utils/cn";
import type { ProductPageImage } from "@/types/product-page";

type ProductGalleryProps = {
  images: ProductPageImage[];
  productName: string;
};

const mainSlotClassName =
  "aspect-[4/5] w-full rounded-2xl bg-muted sm:rounded-3xl";

const thumbSlotClassName = "aspect-[4/5] w-14 shrink-0 rounded-lg bg-muted lg:w-full";

function resolveImageAlt(image: ProductPageImage, fallback: string): string {
  const alt = image.alt?.trim() || image.media.alt?.trim();
  return alt && alt.length > 0 ? alt : fallback;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const dialogTitleId = useId();

  const activeImage = images[activeIndex] ?? null;
  const hasMultiple = images.length > 1;

  const showPrevious = useCallback(() => {
    setActiveIndex((current) =>
      current === 0 ? images.length - 1 : current - 1,
    );
  }, [images.length]);

  const showNext = useCallback(() => {
    setActiveIndex((current) =>
      current === images.length - 1 ? 0 : current + 1,
    );
  }, [images.length]);

  useEffect(() => {
    if (!lightboxOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightboxOpen(false);
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxOpen, showNext, showPrevious]);

  if (!activeImage) {
    return (
      <ProductGallerySlot className={mainSlotClassName}>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(145deg,var(--muted)_0%,var(--card)_45%,var(--background)_100%)]"
        />
        <div className="relative z-[1] flex h-full items-end p-8">
          <span className="font-serif text-2xl leading-tight tracking-[0.02em] text-foreground/35">
            {productName}
          </span>
        </div>
      </ProductGallerySlot>
    );
  }

  return (
    <>
      <div
        className={cn(
          "grid gap-4",
          hasMultiple && "lg:grid-cols-[4.75rem_minmax(0,1fr)] lg:gap-5",
        )}
      >
        {hasMultiple ? (
          <div
            aria-label="Миниатюры"
            className="order-2 flex gap-2 overflow-x-auto pb-1 lg:order-1 lg:flex-col lg:overflow-x-visible lg:overflow-y-auto lg:pb-0"
            role="tablist"
          >
            {images.map((image, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  aria-label={`Показать изображение ${index + 1}`}
                  aria-selected={isActive}
                  className={cn(
                    "block shrink-0 transition-opacity duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 lg:w-full",
                    isActive ? "opacity-100" : "opacity-70 hover:opacity-100",
                  )}
                  key={image.id}
                  onClick={() => setActiveIndex(index)}
                  role="tab"
                  type="button"
                >
                  <ProductGallerySlot
                    className={cn(
                      thumbSlotClassName,
                      isActive &&
                        "ring-1 ring-foreground/25 ring-offset-2 ring-offset-background",
                    )}
                  >
                    <ProductGalleryMedia alt="" src={image.media.url} />
                  </ProductGallerySlot>
                </button>
              );
            })}
          </div>
        ) : null}

        <ProductGallerySlot
          className={cn(mainSlotClassName, "group order-1 lg:order-2")}
        >
          <ProductGalleryMedia
            alt={resolveImageAlt(activeImage, productName)}
            className="transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            priority
            src={activeImage.media.url}
          />
          <button
            aria-label={`Открыть изображение «${productName}»`}
            className="absolute inset-0 z-[1] cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            onClick={() => setLightboxOpen(true)}
            type="button"
          />
        </ProductGallerySlot>
      </div>

      {lightboxOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <button
            aria-label="Закрыть просмотр"
            className="absolute inset-0 bg-black/88"
            onClick={() => setLightboxOpen(false)}
            type="button"
          />

          <div
            aria-labelledby={dialogTitleId}
            aria-modal="true"
            className="relative z-10 flex h-full w-full max-w-6xl flex-col px-4 py-6 sm:px-8"
            role="dialog"
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="sr-only" id={dialogTitleId}>
                {productName}
              </h2>
              <button
                aria-label="Закрыть"
                className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                onClick={() => setLightboxOpen(false)}
                type="button"
              >
                <X aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center">
              {hasMultiple ? (
                <button
                  aria-label="Предыдущее изображение"
                  className="absolute left-0 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 sm:h-11 sm:w-11"
                  onClick={showPrevious}
                  type="button"
                >
                  <ChevronLeft
                    aria-hidden="true"
                    className="h-5 w-5"
                    strokeWidth={1.5}
                  />
                </button>
              ) : null}

              <ProductGallerySlot className="h-[min(78vh,720px)] w-full">
                <ProductGalleryMedia
                  alt={resolveImageAlt(activeImage, productName)}
                  src={activeImage.media.url}
                />
              </ProductGallerySlot>

              {hasMultiple ? (
                <button
                  aria-label="Следующее изображение"
                  className="absolute right-0 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 sm:h-11 sm:w-11"
                  onClick={showNext}
                  type="button"
                >
                  <ChevronRight
                    aria-hidden="true"
                    className="h-5 w-5"
                    strokeWidth={1.5}
                  />
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
