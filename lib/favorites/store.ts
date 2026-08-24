import type { FavoriteIdList } from "@/types/favorites";
import {
  addFavoriteId,
  readFavoriteIds,
  removeFavoriteId,
  setFavoriteIds,
  toggleFavoriteId,
  writeFavoriteIds,
} from "@/lib/favorites/storage";

type FavoritesListener = () => void;

/** Stable empty snapshot for SSR and empty client state. */
export const EMPTY_FAVORITE_IDS: FavoriteIdList = [];

const listeners = new Set<FavoritesListener>();

let snapshot: FavoriteIdList = EMPTY_FAVORITE_IDS;

function snapshotsEqual(a: FavoriteIdList, b: FavoriteIdList): boolean {
  if (a === b) {
    return true;
  }
  if (a.length !== b.length) {
    return false;
  }
  return a.every((id, index) => id === b[index]);
}

function normalizeFavoriteIds(ids: FavoriteIdList): FavoriteIdList {
  if (ids.length === 0) {
    return EMPTY_FAVORITE_IDS;
  }
  return ids;
}

function commitSnapshot(nextIds: FavoriteIdList): void {
  const normalized = normalizeFavoriteIds(nextIds);

  if (snapshotsEqual(snapshot, normalized)) {
    return;
  }

  snapshot =
    normalized === EMPTY_FAVORITE_IDS ? EMPTY_FAVORITE_IDS : [...normalized];
}

function refreshSnapshotFromStorage(): void {
  commitSnapshot(readFavoriteIds());
}

function emitFavoritesChange(): void {
  listeners.forEach((listener) => listener());
}

export function subscribeToFavorites(listener: FavoritesListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getFavoritesSnapshot(): FavoriteIdList {
  refreshSnapshotFromStorage();
  return snapshot;
}

export function getFavoritesServerSnapshot(): FavoriteIdList {
  return EMPTY_FAVORITE_IDS;
}

function updateFavoriteIds(nextIds: FavoriteIdList): void {
  const normalized = normalizeFavoriteIds(nextIds);
  writeFavoriteIds(
    normalized === EMPTY_FAVORITE_IDS ? [] : [...normalized],
  );
  const previous = snapshot;
  commitSnapshot(normalized);
  if (previous !== snapshot) {
    emitFavoritesChange();
  }
}

export function getFavorites(): FavoriteIdList {
  return getFavoritesSnapshot();
}

export function isFavorite(productId: string): boolean {
  return getFavoritesSnapshot().includes(productId);
}

export function addFavorite(productId: string): void {
  updateFavoriteIds(addFavoriteId(productId));
}

export function removeFavorite(productId: string): void {
  updateFavoriteIds(removeFavoriteId(productId));
}

export function toggleFavorite(productId: string): void {
  updateFavoriteIds(toggleFavoriteId(productId));
}

export function clearFavorites(): void {
  updateFavoriteIds(EMPTY_FAVORITE_IDS);
}

export function syncFavoriteIds(nextIds: FavoriteIdList): void {
  setFavoriteIds(nextIds);
  const previous = snapshot;
  refreshSnapshotFromStorage();
  if (previous !== snapshot) {
    emitFavoritesChange();
  }
}

export function getFavoritesCountFromSnapshot(ids: FavoriteIdList): number {
  return ids.length;
}
