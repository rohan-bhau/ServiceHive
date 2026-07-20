import { baseApi } from './baseApi';

export const adminApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAdminStats: builder.query({
      query: () => '/admin/stats',
      providesTags: ['Admin'],
    }),
    getUsers: builder.query({
      query: () => '/admin/users',
      providesTags: ['Users'],
    }),
    updateUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `/admin/users/${id}/role`,
        method: 'PATCH',
        body: { role },
      }),
      invalidatesTags: ['Users'],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({ url: `/admin/users/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Users'],
    }),
    getPendingServices: builder.query({
      query: () => '/admin/services/pending',
      providesTags: ['PendingServices'],
    }),
    approveService: builder.mutation({
      query: (id) => ({ url: `/admin/services/${id}/approve`, method: 'PATCH' }),
      invalidatesTags: ['PendingServices', 'Services'],
    }),
    deleteService: builder.mutation({
      query: (id) => ({ url: `/admin/services/${id}`, method: 'DELETE' }),
      invalidatesTags: ['PendingServices', 'Services'],
    }),
  }),
});

export const {
  useGetAdminStatsQuery,
  useGetUsersQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
  useGetPendingServicesQuery,
  useApproveServiceMutation,
  useDeleteServiceMutation,
} = adminApi;
