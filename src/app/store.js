import { configureStore } from "@reduxjs/toolkit";
import { indexApi } from "../features/api/indexApi";

export default configureStore({
    reducer:{
        [indexApi.reducerPath]: indexApi.reducer,
    },
    middleware:(getDefaultMiddleware) => getDefaultMiddleware().concat([indexApi.middleware]),
})