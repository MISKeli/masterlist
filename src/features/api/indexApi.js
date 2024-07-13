import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const indexApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseurl: `${import.meta.env.VITE_MASTERLIST_ENDPOINT}`,
    prepareHeaders: (headers, { getState }) => {
      // headers.set("Authorized")'
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  endpoints: () => ({}),
});
