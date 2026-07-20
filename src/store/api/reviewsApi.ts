import { baseApi } from './baseApi';

export const reviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query({
      query: (serviceId) => `/services/${serviceId}/reviews`,
      providesTags: ['Reviews'],
    }),
    createReview: builder.mutation({
      query: ({ serviceId, ...body }) => ({
        url: `/services/${serviceId}/reviews`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Reviews', 'Services'],
    }),
  }),
});

export const { useGetReviewsQuery, useCreateReviewMutation } = reviewsApi;
