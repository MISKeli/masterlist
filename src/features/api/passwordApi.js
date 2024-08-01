import { indexApi } from "./indexApi";

const passwordApi = indexApi
  .enhanceEndpoints({ addTagTypes: ["password"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      updateResetPassword: builder.mutation({
        query: (id) => ({
          url: `/resetpassword/${id}`,
          method: "PATCH",
        }),
        invalidatesTags: (_, error) => (error ? [] : ["password"]),
      }),
      updateChangePassword: builder.mutation({
        query: ({ ...body }) => ({
          url: `/changepassword`,
          method: "PATCH",
          body: body,
        }),
        invalidatesTags: (_, error) => (error ? [] : ["password"]),
      }),
    }),
  });

export const {
  useUpdateChangePasswordMutation,
  useUpdateResetPasswordMutation,
} = passwordApi;
