import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getTokenFromStorage } from '@/lib/utils';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  prepareHeaders: (headers) => {
    const token = getTokenFromStorage();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Auth', 'Requests'],
  endpoints: () => ({}),
});