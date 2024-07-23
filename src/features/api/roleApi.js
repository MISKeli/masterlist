import { indexApi } from "./indexApi";

const roleApi = indexApi
  .enhanceEndpoints({ addTagTypes: ["role"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getRole: builder.query({
        query: (params) => ({
          url: `/role`,
          method: "GET",
          params,
        }),
        providesTags: ["role"],
      }),
      addRole: builder.mutation({
        query: (body) => ({
          url: `/role`,
          method: "POST",
          body: body,
        }),
        invalidatesTags: ["role"],
      }),
      updateRole: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `/role/${id}`,
          method: "PATCH",
          body: body,
        }),
        invalidatesTags: (_, error) => (error ? [] : ["role"]),
      }),
      archivedRole: builder.mutation({
        query: (id) => ({
          url: `/role-archived/${id}`,
          method: "PUT",
        }),
        invalidatesTags: (_, error) => (error ? [] : ["role"]),
      }),
    }),
  });

export const {
  useGetRoleQuery,
  useAddRoleMutation,
  useArchivedRoleMutation,
  useUpdateRoleMutation,
} = roleApi;
