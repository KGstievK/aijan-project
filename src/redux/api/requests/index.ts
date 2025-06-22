import { api } from '../index';
import { Request, CreateRequestData, UpdateRequestData } from '@/types/requests';

export const requestsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getRequests: build.query<Request[], void>({
      query: () => '/api/requests',
      providesTags: ['Requests'],
    }),
    createRequest: build.mutation<Request, CreateRequestData>({
      query: (data) => ({
        url: '/api/requests',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Requests'],
    }),
    updateRequest: build.mutation<Request, { id: number; data: UpdateRequestData }>({
      query: ({ id, data }) => ({
        url: `/api/requests/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Requests'],
    }),
    deleteRequest: build.mutation<void, number>({
      query: (id) => ({
        url: `/api/requests/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Requests'],
    }),
  }),
});

export const {
  useGetRequestsQuery,
  useCreateRequestMutation,
  useUpdateRequestMutation,
  useDeleteRequestMutation,
} = requestsApi;