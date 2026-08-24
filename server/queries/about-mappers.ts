import "server-only";

import { toMediaRef } from "@/server/queries/mappers";
import {
  DEFAULT_ABOUT_IMAGE_POSITION,
  isAboutImagePosition,
  type AboutImagePosition,
  type AboutSectionData,
  type AboutSettings,
} from "@/types/about";

type MediaRecord = {
  id: string;
  url: string;
  alt: string | null;
  width: number | null;
  height: number | null;
  mimeType: string;
};

function resolveImagePosition(value: unknown): AboutImagePosition {
  if (typeof value === "string" && isAboutImagePosition(value)) {
    return value;
  }

  return DEFAULT_ABOUT_IMAGE_POSITION;
}

export function mapAboutSection(section: {
  id: string;
  title: string | null;
  description: string | null;
  buttonText: string | null;
  buttonUrl: string | null;
  settings: unknown;
  image: MediaRecord | null;
  mobileImage: MediaRecord | null;
}): AboutSectionData | null {
  const settings = (section.settings ?? {}) as AboutSettings;

  const data: AboutSectionData = {
    id: section.id,
    overline: settings.overline?.trim() || null,
    title: section.title?.trim() || null,
    description: section.description?.trim() || null,
    buttonText: section.buttonText?.trim() || null,
    buttonUrl: section.buttonUrl?.trim() || null,
    image: toMediaRef(section.image),
    mobileImage: toMediaRef(section.mobileImage),
    imagePosition: resolveImagePosition(settings.imagePosition),
  };

  const hasContent = Boolean(
    data.overline ||
      data.title ||
      data.description ||
      (data.buttonText && data.buttonUrl) ||
      data.image ||
      data.mobileImage,
  );

  return hasContent ? data : null;
}
