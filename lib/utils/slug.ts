const NON_SLUG_CHARS = /[^a-z0-9]+/g;
const TRIM_HYPHENS = /^-+|-+$/g;

export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(NON_SLUG_CHARS, "-")
    .replace(TRIM_HYPHENS, "");
}

export const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
