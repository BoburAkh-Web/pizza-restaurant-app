import { createSlice } from "@reduxjs/toolkit";

// Favorite pizza ids are kept in localStorage (see store.js), so they survive a reload
const STORAGE_KEY = "favoritePizzaIds";

function loadFavoriteIds() {
  try {
    const ids = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(ids) ? ids.filter(Number.isInteger) : [];
  } catch {
    return [];
  }
}

export function saveFavoriteIds(ids) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // storage blocked (e.g. private mode): favorites just won't survive a reload
  }
}

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: { ids: loadFavoriteIds() },
  reducers: {
    toggleFavorite(state, action) {
      const id = action.payload;
      state.ids = state.ids.includes(id)
        ? state.ids.filter((favoriteId) => favoriteId !== id)
        : [...state.ids, id];
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;

export const getFavoriteIds = (state) => state.favorites.ids;
export const getIsFavorite = (id) => (state) =>
  state.favorites.ids.includes(id);
