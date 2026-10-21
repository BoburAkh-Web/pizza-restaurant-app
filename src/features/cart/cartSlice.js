import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action) {},
    deleteItem(state, action) {},
    increaseItemQuant(state, action) {},
    decreaseItemQuant(state, action) {},
    clearItem(state, action) {},
  },
});

export default cartSlice.reducer;
