// store/index.js
import { configureStore } from "@reduxjs/toolkit";
import Reducer from "./Reducer";

const Store = configureStore({
  reducer: {
    user: Reducer,
  },
});

export default Store;
