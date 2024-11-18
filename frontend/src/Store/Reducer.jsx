// store/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: {}, // Initial state for user data
};

const Reducer = createSlice({
  name: "user",
  initialState,
  reducers: {
    saveUserData: (state, action) => {
      state.userData = action.payload; // Save user data to state
    },
    clearUserData: (state) => {
      state.userData = {}; // Clear user data
    },
  },
});

export const { saveUserData, clearUserData } = Reducer.actions;

export default Reducer.reducer;
