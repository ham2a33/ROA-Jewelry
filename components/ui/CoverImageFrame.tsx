import { cn } from "@/lib/utils/cn";

type CoverImageFrameProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Fixed-size image slot. Pass existing size classes (aspect-*, h-*, w-*)
 * via className — the frame never adapts to the uploaded image dimensions.
 */
export function CoverImageFrame({
  children,
  className,
}: CoverImageFrameProps) {
  return (
    <div className={cn("cover-image-frame relative w-full overflow-hidden", className)}>
      {children}
    </div>
  );
}
