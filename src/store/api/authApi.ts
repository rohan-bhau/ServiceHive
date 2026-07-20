import { baseApi } from './baseApi';
import { setUser, logout as logoutAction } from '../features/authSlice';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
      transformResponse: (response: any) => response.user,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch { }
      },
    }),
    login: builder.mutation({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
      transformResponse: (response: any) => response.user,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch { }
      },
    }),
    googleLogin: builder.mutation({
      query: (body) => ({ url: '/auth/google', method: 'POST', body }),
      transformResponse: (response: any) => response.user,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch { }
      },
    }),
    demoLogin: builder.mutation({
      query: () => ({ url: '/auth/demo', method: 'POST' }),
      transformResponse: (response: any) => response.user,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch { }
      },
    }),
    demoProviderLogin: builder.mutation({
      query: () => ({ url: '/auth/demo/provider', method: 'POST' }),
      transformResponse: (response: any) => response.user,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch { }
      },
    }),
    logout: builder.mutation({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logoutAction());
        } catch { }
      },
    }),
    getMe: builder.query({
      query: () => '/auth/me',
      transformResponse: (response: any) => response.user,
      providesTags: ['Auth'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch { }
      },
    }),
    updateProfile: builder.mutation({
      query: (body) => ({ url: '/auth/profile', method: 'PUT', body }),
      transformResponse: (response: any) => response.user,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch { }
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGoogleLoginMutation,
  useDemoLoginMutation,
  useDemoProviderLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
  useUpdateProfileMutation,
} = authApi;
