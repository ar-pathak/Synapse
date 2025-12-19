import { configureStore } from "@reduxjs/toolkit";
import userinfoReducer from "./slice/userinfoSlice";
export const store = configureStore({
  reducer: {
    userinfo: userinfoReducer,
  },
});
