import type { MediaRef } from "@/lib/media/types";

export const ABOUT_IMAGE_POSITIONS = ["left", "right"] as const;

export type AboutImagePosition = (typeof ABOUT_IMAGE_POSITIONS)[number];

export type AboutSectionData = {
  id: string;
  overline: string | null;
  title: string | null;
  description: string | null;
  buttonText: string | null;
  buttonUrl: string | null;
  image: MediaRef | null;
  mobileImage: MediaRef | null;
  imagePosition: AboutImagePosition;
};

export type AboutSettings = {
  overline?: string;
  imagePosition?: AboutImagePosition;
};

export function isAboutImagePosition(
  value: string,
): value is AboutImagePosition {
  return ABOUT_IMAGE_POSITIONS.includes(value as AboutImagePosition);
}

export const DEFAULT_ABOUT_IMAGE_POSITION: AboutImagePosition = "left";
