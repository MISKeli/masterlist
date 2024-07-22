import { indexApi } from "./indexApi";

const roleApi = indexApi
  .enhanceEndpoints({ addTagTypes: ["role"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getRole: builder.query({
        query: () => ({
          url: "/role",
          method: "GET",

        }),
      }),
    }),
  });

export const { useGetRoleQuery } = roleApi;
