import { configureStore } from "@reduxjs/toolkit";
import { ProductsSlice } from "./Slices/ProductsSlice";
import UserSlice from "./Slices/UserSlice";

export const Store = configureStore({
  reducer: {
    User: UserSlice,
    [ProductsSlice.reducerPath]: ProductsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([ProductsSlice.middleware]),
});

// Export hooks for dispatch and selector
export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
