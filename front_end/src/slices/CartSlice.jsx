import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartCount: parseInt(localStorage.getItem("cartCount")) || 0,
};

const CartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    incrementCartBy: (state, action) => {
      state.cartCount += action.payload;
      localStorage.setItem("cartCount", state.cartCount); 
    },
    resetCart: (state) => {
      state.cartCount = 0;
      localStorage.removeItem("cartCount");
    },
    setCartCount: (state, action) => {
      state.cartCount = action.payload;
      localStorage.setItem("cartCount", state.cartCount);
    },
  },
});

export const { incrementCartBy, resetCart, setCartCount } = CartSlice.actions;
export default CartSlice.reducer;
