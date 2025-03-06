import { configureStore } from "@reduxjs/toolkit";
import memeReducer from "./memeSlice";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    memes: memeReducer,
    auth: authReducer,
  },
});
