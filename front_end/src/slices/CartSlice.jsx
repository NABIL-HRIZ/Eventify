import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartCount: 0,
};

const CartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    incrementCart: (state) => {
      state.cartCount += 1;
    },
    setCartCount: (state, action) => {
      state.cartCount = action.payload;
    },
  },
});

export const { incrementCart, setCartCount } = CartSlice.actions;
export default CartSlice.reducer;
