import { indexApi } from "./indexApi";

const loginApi = indexApi
  .enhanceEndpoints({ addTagTypes: ["User"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      postLogin: builder.mutation({
        query: (body) => ({
          url: "/login",
          method: "POST",
          body,
        }),
      }),
    }),
  });

export const { usePostLoginMutation } = loginApi;
