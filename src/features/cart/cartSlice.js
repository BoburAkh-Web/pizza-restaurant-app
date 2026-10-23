import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Items are identified by cartItemId (pizza + size + extras), not pizzaId,
    // because the same pizza can be in the cart with different options.
    addItem(state, action) {
      const newItem = action.payload;
      const item = state.cart.find(
        (item) => item.cartItemId === newItem.cartItemId,
      );
      if (!item) {
        state.cart.push(newItem);
        return;
      }
      item.quantity += newItem.quantity;
      item.totalPrice = item.quantity * item.unitPrice;
    },
    deleteItem(state, action) {
      state.cart = state.cart.filter(
        (item) => item.cartItemId !== action.payload,
      );
    },
    increaseItemQuant(state, action) {
      const item = state.cart.find(
        (item) => item.cartItemId === action.payload,
      );
      item.quantity++;
      item.totalPrice = item.quantity * item.unitPrice;
    },
    decreaseItemQuant(state, action) {
      const item = state.cart.find(
        (item) => item.cartItemId === action.payload,
      );
      item.quantity--;
      item.totalPrice = item.quantity * item.unitPrice;
      if (item.quantity === 0) cartSlice.caseReducers.deleteItem(state, action);
    },
    clearItem(state) {
      state.cart = [];
    },
    // Reverts an addItem (the toast's Undo button): takes the added quantity back
    undoAddItem(state, action) {
      const { cartItemId, quantity } = action.payload;
      const item = state.cart.find((item) => item.cartItemId === cartItemId);
      if (!item) return;
      item.quantity -= quantity;
      item.totalPrice = item.quantity * item.unitPrice;
      if (item.quantity <= 0)
        cartSlice.caseReducers.deleteItem(state, { payload: cartItemId });
    },
  },
});

export const {
  addItem,
  deleteItem,
  increaseItemQuant,
  decreaseItemQuant,
  clearItem,
  undoAddItem,
} = cartSlice.actions;

export default cartSlice.reducer;
export const getCart = (state) => state.cart.cart;
export const getTotalCartQuantity = (state) =>
  state.cart.cart.reduce((sum, item) => sum + item.quantity, 0);

export const getTotalCartPrice = (state) =>
  state.cart.cart.reduce((sum, item) => sum + item.totalPrice, 0);
export const getQuantityByCartItemId = (cartItemId) => (state) =>
  state.cart.cart.find((item) => item.cartItemId === cartItemId)?.quantity ?? 0;

// All sizes and extras of one pizza together
export const getPizzaQuantityInCart = (pizzaId) => (state) =>
  state.cart.cart
    .filter((item) => item.pizzaId === pizzaId)
    .reduce((sum, item) => sum + item.quantity, 0);
