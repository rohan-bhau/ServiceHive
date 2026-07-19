import { baseApi } from './baseApi';

export const bookingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBookings: builder.query({
      query: (params) => ({ url: '/bookings', params }),
      providesTags: ['Bookings'],
    }),
    createBooking: builder.mutation({
      query: (body) => ({ url: '/bookings', method: 'POST', body }),
      invalidatesTags: ['Bookings'],
    }),
    getBookingStats: builder.query({
      query: () => '/bookings/stats',
      providesTags: ['Bookings'],
    }),
  }),
});

export const { useGetBookingsQuery, useCreateBookingMutation, useGetBookingStatsQuery } = bookingsApi;
