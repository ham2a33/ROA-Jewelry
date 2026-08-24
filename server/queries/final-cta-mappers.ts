import "server-only";

import { z } from "zod";
import { toMediaRef } from "@/server/queries/mappers";
import {
  DEFAULT_FINAL_CTA_OVERLAY,
  type FinalCtaSectionData,
  type FinalCtaSettings,
} from "@/types/final-cta";

type MediaRecord = {
  id: string;
  url: string;
  alt: string | null;
  width: number | null;
  height: number | null;
  mimeType: string;
};

const finalCtaSettingsSchema = z.object({
  overline: z.string().optional(),
  overlay: z.number().min(0).max(1).optional(),
});

function parseFinalCtaSettings(settings: unknown): FinalCtaSettings {
  const parsed = finalCtaSettingsSchema.safeParse(settings);
  return parsed.success ? parsed.data : {};
}

function resolveOverlay(value: number | undefined): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.min(1, Math.max(0, value));
  }

  return DEFAULT_FINAL_CTA_OVERLAY;
}

export function mapFinalCtaSection(section: {
  id: string;
  title: string | null;
  description: string | null;
  buttonText: string | null;
  buttonUrl: string | null;
  settings: unknown;
  image: MediaRecord | null;
  mobileImage: MediaRecord | null;
}): FinalCtaSectionData | null {
  const settings = parseFinalCtaSettings(section.settings);

  const data: FinalCtaSectionData = {
    id: section.id,
    overline: settings.overline?.trim() || null,
    title: section.title?.trim() || null,
    description: section.description?.trim() || null,
    buttonText: section.buttonText?.trim() || null,
    buttonUrl: section.buttonUrl?.trim() || null,
    image: toMediaRef(section.image),
    mobileImage: toMediaRef(section.mobileImage),
    overlay: resolveOverlay(settings.overlay),
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
