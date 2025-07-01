"use client";
import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "../app/Redux/searchSlice";

export const store = configureStore({
  reducer: {
    search: searchReducer,
  },
});

// Types for usage in app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
