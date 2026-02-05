import { apiSlice } from '../../api/apiSlice';

export const specialistApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSpecialists: builder.query({
            query: () => '/specialists',
            providesTags: ['Specialist'],
        }),
        createSpecialist: builder.mutation({
            query: (formData) => ({
                url: '/specialists',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Specialist'],
        }),
        exportSpecialists: builder.mutation<Blob, void>({
            query: () => ({
                url: '/specialists/export',
                method: 'GET',
                responseHandler: (response) => response.blob(),
                cache: 'no-cache',
            }),
        }),
    }),
});

export const { useGetSpecialistsQuery, useCreateSpecialistMutation, useExportSpecialistsMutation } = specialistApi;
