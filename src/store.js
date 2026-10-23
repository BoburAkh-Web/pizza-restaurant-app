import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import cartReducer from "./features/cart/cartSlice";
import favoritesReducer, {
  saveFavoriteIds,
} from "./features/favorites/favoritesSlice";
const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    favorites: favoritesReducer,
  },
});

// Write favorites to localStorage whenever they change (a new array means they changed)
let savedFavoriteIds = store.getState().favorites.ids;
store.subscribe(() => {
  const { ids } = store.getState().favorites;
  if (ids === savedFavoriteIds) return;
  savedFavoriteIds = ids;
  saveFavoriteIds(ids);
});

export default store;
