import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils/cn";

type CoverImageProps = Omit<ImageProps, "fill" | "width" | "height"> & {
  alt: string;
  src: string;
};

/**
 * Fills a fixed-size relative parent with object-fit: cover.
 * Parent must define dimensions and use `cover-image-frame` (or
 * `relative overflow-hidden` with explicit width/height).
 */
export function CoverImage({ className, alt, sizes, ...props }: CoverImageProps) {
  return (
    <Image
      {...props}
      alt={alt}
      fill
      sizes={sizes ?? "100vw"}
      className={cn(
        "absolute inset-0 h-full w-full max-h-none max-w-none object-cover object-center",
        className,
      )}
    />
  );
}
