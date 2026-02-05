import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://anycomp-backend-eight.vercel.app/api' }),
    tagTypes: ['Specialist'],
    endpoints: () => ({}),
});
