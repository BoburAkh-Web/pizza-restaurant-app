import { configureStore } from "@reduxjs/toolkit";
import userReducer, { saveUsername } from "./features/user/userSlice";
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

// Write the username and favorites to localStorage whenever they change
let { username: savedUsername } = store.getState().user;
let savedFavoriteIds = store.getState().favorites.ids;
store.subscribe(() => {
  const { user, favorites } = store.getState();
  if (user.username !== savedUsername) {
    savedUsername = user.username;
    saveUsername(user.username);
  }
  // a new array means the favorites changed
  if (favorites.ids !== savedFavoriteIds) {
    savedFavoriteIds = favorites.ids;
    saveFavoriteIds(favorites.ids);
  }
});

export default store;
