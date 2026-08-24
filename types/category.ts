import type { MediaRef } from "@/lib/media/types";

export type HomepageCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: MediaRef | null;
};
