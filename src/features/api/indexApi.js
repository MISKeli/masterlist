import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const indexApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_MASTERLIST_ENDPOINT}`,
    prepareHeaders: (headers, { getState }) => {
      headers.set("Authorization", "Bearer " + getState().auth.token);
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  endpoints: () => ({}),
});
