import { indexApi } from "./indexApi";

const userApi = indexApi
  .enhanceEndpoints({ addTagTypes: ["users"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getUser: builder.query({
        query: (params) => ({
          url: `/users`,
          method: "GET",
          params,
        }),
        providesTags: ["users"],
      }),
      addUser: builder.mutation({
        query: (body) => ({
          url: `/users`,
          method: "POST",
          body: body,
        }),
        invalidatesTags: ["users"],
      }),
      updateUser: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `/users/${id}`,
          method: "PATCH",
          body: body,
        }),
        invalidatesTags: (_, error) => (error ? [] : ["users"]),
      }),
      archivedUser: builder.mutation({
        query: (id) => ({
          url: `/user-archived/${id}`,
          method: "PUT",
        }),
        invalidatesTags: (_, error) => (error ? [] : ["users"]),
      }),
    }),
  });

export const {
  useAddUserMutation,
  useArchivedUserMutation,
  useGetUserQuery,
  useUpdateUserMutation,
} = userApi;
