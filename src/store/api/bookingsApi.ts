import { baseApi } from './baseApi';

export const bookingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBookings: builder.query({
      query: () => '/bookings/mine',
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
    updateBookingStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/bookings/${id}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Bookings'],
    }),
  }),
});

export const { useGetBookingsQuery, useCreateBookingMutation, useGetBookingStatsQuery, useUpdateBookingStatusMutation } = bookingsApi;
