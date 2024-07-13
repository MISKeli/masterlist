import { configureStore } from "@reduxjs/toolkit";
import { indexApi } from "../features/api/indexApi";
import authSlice from "../features/slice/authSlice";

export default configureStore({
  reducer: {
    [indexApi.reducerPath]: indexApi.reducer,
    auth: authSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([indexApi.middleware]),
});
