import type { MediaRef } from "@/lib/media/types";

export type FinalCtaSettings = {
  overline?: string;
  overlay?: number;
};

export type FinalCtaSectionData = {
  id: string;
  overline: string | null;
  title: string | null;
  description: string | null;
  buttonText: string | null;
  buttonUrl: string | null;
  image: MediaRef | null;
  mobileImage: MediaRef | null;
  overlay: number;
};

export const DEFAULT_FINAL_CTA_OVERLAY = 0.25;
