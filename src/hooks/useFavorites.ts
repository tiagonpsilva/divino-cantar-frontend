import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'divino-cantar-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem(FAVORITES_KEY);
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error loading favorites:', error);
        setFavorites([]);
      }
    }
  }, []);

  const saveFavorites = (newFavorites: string[]) => {
    setFavorites(newFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  };

  const addFavorite = (songId: string) => {
    if (!favorites.includes(songId)) {
      const newFavorites = [...favorites, songId];
      saveFavorites(newFavorites);
    }
  };

  const removeFavorite = (songId: string) => {
    const newFavorites = favorites.filter(id => id !== songId);
    saveFavorites(newFavorites);
  };

  const toggleFavorite = (songId: string) => {
    if (favorites.includes(songId)) {
      removeFavorite(songId);
    } else {
      addFavorite(songId);
    }
  };

  const isFavorite = (songId: string) => {
    return favorites.includes(songId);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite
  };
}