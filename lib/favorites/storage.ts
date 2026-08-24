import type { FavoriteIdList } from "@/types/favorites";
import { FAVORITES_STORAGE_KEY } from "@/types/favorites";

function isFavoriteIdList(value: unknown): value is FavoriteIdList {
  return (
    Array.isArray(value) &&
    value.every((entry) => typeof entry === "string" && entry.length > 0)
  );
}

export function readFavoriteIds(): FavoriteIdList {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);
    if (!isFavoriteIdList(parsed)) {
      return [];
    }

    return [...new Set(parsed)];
  } catch {
    return [];
  }
}

export function writeFavoriteIds(ids: FavoriteIdList): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids));
}

export function addFavoriteId(productId: string): FavoriteIdList {
  const ids = readFavoriteIds();
  if (ids.includes(productId)) {
    return ids;
  }

  const nextIds = [...ids, productId];
  writeFavoriteIds(nextIds);
  return nextIds;
}

export function removeFavoriteId(productId: string): FavoriteIdList {
  const nextIds = readFavoriteIds().filter((id) => id !== productId);
  writeFavoriteIds(nextIds);
  return nextIds;
}

export function toggleFavoriteId(productId: string): FavoriteIdList {
  const ids = readFavoriteIds();
  if (ids.includes(productId)) {
    return removeFavoriteId(productId);
  }

  return addFavoriteId(productId);
}

export function setFavoriteIds(ids: FavoriteIdList): void {
  writeFavoriteIds([...new Set(ids)]);
}

export function getFavoriteCount(ids: FavoriteIdList): number {
  return ids.length;
}
