import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    credentials: 'include',
  }),
  tagTypes: ['Auth', 'Services', 'Reviews', 'Bookings', 'Conversations', 'Recommendations', 'Admin', 'Users', 'PendingServices'],
  endpoints: () => ({}),
});
