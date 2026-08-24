"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  addFavorite,
  clearFavorites,
  getFavoritesCountFromSnapshot,
  getFavoritesServerSnapshot,
  getFavoritesSnapshot,
  removeFavorite,
  subscribeToFavorites,
  toggleFavorite,
} from "@/lib/favorites/store";

type FavoritesContextValue = {
  favoriteIds: string[];
  favoritesCount: number;
  isFavorite: (productId: string) => boolean;
  addFavorite: (productId: string) => void;
  removeFavorite: (productId: string) => void;
  toggleFavorite: (productId: string) => void;
  clearFavorites: () => void;
};

const FavoritesContext = createContext<FavoritesContextValue | undefined>(
  undefined,
);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const favoriteIds = useSyncExternalStore(
    subscribeToFavorites,
    getFavoritesSnapshot,
    getFavoritesServerSnapshot,
  );

  const isFavorite = useCallback(
    (productId: string) => favoriteIds.includes(productId),
    [favoriteIds],
  );

  const addFavoriteItem = useCallback((productId: string) => {
    addFavorite(productId);
  }, []);

  const removeFavoriteItem = useCallback((productId: string) => {
    removeFavorite(productId);
  }, []);

  const toggleFavoriteItem = useCallback((productId: string) => {
    toggleFavorite(productId);
  }, []);

  const clearFavoriteItems = useCallback(() => {
    clearFavorites();
  }, []);

  const favoritesCount = useMemo(
    () => getFavoritesCountFromSnapshot(favoriteIds),
    [favoriteIds],
  );

  const value = useMemo(
    () => ({
      favoriteIds,
      favoritesCount,
      isFavorite,
      addFavorite: addFavoriteItem,
      removeFavorite: removeFavoriteItem,
      toggleFavorite: toggleFavoriteItem,
      clearFavorites: clearFavoriteItems,
    }),
    [
      addFavoriteItem,
      clearFavoriteItems,
      favoriteIds,
      favoritesCount,
      isFavorite,
      removeFavoriteItem,
      toggleFavoriteItem,
    ],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }

  return context;
}
