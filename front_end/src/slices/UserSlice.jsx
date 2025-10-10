// src/redux/slices/UserSlice.jsx
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  purchasedEvents: [], // this stores tickets
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    addPurchasedEvent: (state, action) => {
      state.purchasedEvents.push(action.payload);
    },
    setPurchasedEvents: (state, action) => {
      state.purchasedEvents = action.payload; // <-- we need this
    },
  },
});

export const { setUser, addPurchasedEvent, setPurchasedEvents } = userSlice.actions;
export default userSlice.reducer;
