import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'inventoryFavorites';

function parseStorageValue(value) {
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.filter((id) => typeof id === 'number');
    }
  } catch {
    // ignore
  }
  return [];
}

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState([]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setFavoriteIds(parseStorageValue(stored));
    }
  }, []);

  const persist = useCallback((nextIdsOrUpdater) => {
    setFavoriteIds((current) => {
      const nextIds = typeof nextIdsOrUpdater === 'function' ? nextIdsOrUpdater(current) : nextIdsOrUpdater;
      const normalized = Array.isArray(nextIds) ? nextIds.filter((id) => typeof id === 'number') : [];

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      }

      return normalized;
    });
  }, []);

  const toggleFavorite = useCallback(
    (id) => {
      persist((current) => {
        const next = Array.isArray(current) ? current.slice() : [];
        const index = next.indexOf(id);
        if (index >= 0) {
          next.splice(index, 1);
        } else {
          next.push(id);
        }
        return next;
      });
    },
    [persist],
  );

  const removeFavorite = useCallback(
    (id) => {
      persist((current) => current.filter((favoriteId) => favoriteId !== id));
    },
    [persist],
  );

  const clearFavorites = useCallback(() => {
    persist([]);
  }, [persist]);

  const isFavorite = useCallback(
    (id) => favoriteIds.includes(id),
    [favoriteIds],
  );

  return {
    favoriteIds,
    toggleFavorite,
    removeFavorite,
    clearFavorites,
    isFavorite,
  };
}
