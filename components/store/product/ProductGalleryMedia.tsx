import { cn } from "@/lib/utils/cn";

type ProductGalleryMediaProps = {
  alt: string;
  className?: string;
  priority?: boolean;
  src: string;
};

/**
 * Product-page gallery layer. Uses a native <img> so the file's intrinsic
 * dimensions never affect the slot geometry — only the parent slot does.
 */
export function ProductGalleryMedia({
  alt,
  className,
  priority = false,
  src,
}: ProductGalleryMediaProps) {
  return (
    // Native img avoids the Next.js Image wrapper span that was preventing
    // small uploads from scaling to the full gallery slot.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt}
      className={cn("product-gallery-media", className)}
      decoding="async"
      draggable={false}
      fetchPriority={priority ? "high" : undefined}
      loading={priority ? "eager" : "lazy"}
      src={src}
    />
  );
}

type ProductGallerySlotProps = {
  children: React.ReactNode;
  className?: string;
};

/** Fixed geometry slot for product gallery images (main, thumb, lightbox). */
export function ProductGallerySlot({
  children,
  className,
}: ProductGallerySlotProps) {
  return (
    <div className={cn("product-gallery-slot", className)}>{children}</div>
  );
}
