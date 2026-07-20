import { baseApi } from './baseApi';

export const aiApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: () => '/ai/conversations',
      providesTags: ['Conversations'],
    }),
    getConversationById: builder.query({
      query: (id) => `/ai/conversations/${id}`,
      providesTags: (result, error, id) => [{ type: 'Conversations', id }],
    }),
    generateListing: builder.mutation({
      query: (body) => ({ url: '/ai/generate-listing', method: 'POST', body }),
    }),
    getRecommendations: builder.query({
      query: () => '/ai/recommendations',
      providesTags: ['Recommendations'],
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetConversationByIdQuery,
  useGenerateListingMutation,
  useGetRecommendationsQuery,
} = aiApi;

