import type { MediaRef } from "@/lib/media/types";

export type HeroSectionData = {
  id: string;
  title: string | null;
  subtitle: string | null;
  buttonText: string | null;
  buttonUrl: string | null;
  overline: string | null;
  image: MediaRef | null;
  mobileImage: MediaRef | null;
};

export type HeroSettings = {
  overline?: string;
};
