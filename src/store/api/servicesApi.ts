import { baseApi } from './baseApi';

export const servicesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getServices: builder.query({
      query: (params) => ({ url: '/services', params }),
      providesTags: ['Services'],
      serializeQueryArgs: ({ queryArgs }) => {
        const { page, ...rest } = queryArgs;
        return rest;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 1) return newItems;
        return {
          ...newItems,
          services: [...currentCache.services, ...newItems.services],
        };
      },
      forceRefetch: ({ currentArg, previousArg }) => currentArg !== previousArg,
    }),
    getServiceById: builder.query({
      query: (id) => `/services/${id}`,
      providesTags: (result, error, id) => [{ type: 'Services', id }],
    }),
    createService: builder.mutation({
      query: (body) => ({ url: '/services', method: 'POST', body }),
      invalidatesTags: ['Services'],
    }),
    updateService: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/services/${id}`, method: 'PUT', body }),
      invalidatesTags: (result, error, { id }) => ['Services', { type: 'Services', id }],
    }),
    deleteService: builder.mutation({
      query: (id) => ({ url: `/services/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Services'],
    }),
    getRelatedServices: builder.query({
      query: (id) => `/services/${id}/related`,
    }),
    trackView: builder.mutation({
      query: (serviceId) => ({
        url: '/events/view',
        method: 'POST',
        body: { serviceId },
      }),
    }),
    trackSave: builder.mutation({
      query: (serviceId) => ({
        url: '/events/save',
        method: 'POST',
        body: { serviceId },
      }),
      invalidatesTags: ['Recommendations'],
    }),
    getPlatformStats: builder.query({
      query: () => '/stats',
    }),
  }),
});

export const {
  useGetServicesQuery,
  useGetServiceByIdQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useGetRelatedServicesQuery,
  useLazyGetServicesQuery,
  useTrackViewMutation,
  useTrackSaveMutation,
  useGetPlatformStatsQuery,
} = servicesApi;


