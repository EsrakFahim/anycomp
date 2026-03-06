import { apiSlice } from '../../api/apiSlice';

export const specialistApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSpecialists: builder.query({
            query: ({
                page = 1,
                limit = 10,
                search = '',
                is_draft
            }) => {
                const params = new URLSearchParams()
                if (page) params.append('page', page.toString())
                if (limit) params.append('limit', limit.toString())
                if (search) params.append('search', search)
                if (is_draft !== undefined) params.append('is_draft', is_draft.toString())

                return ({
                    url: `/specialists?${params.toString()}`,
                })
            },
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
        getSingleSpecialist: builder.query({
            query: (id) => `/specialists/${id}`,
            providesTags: (result, error, id) => [{ type: 'Specialist', id }],
        }),
        deleteSpecialist: builder.mutation({
            query: (id) => ({
                url: `/specialists/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Specialist', id }],
        }),
        updateSpecialist: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/specialists/${id}`,
                method: 'PUT',
                body: formData,
            }),
            invalidatesTags: ['Specialist'],
        }),

        getServicesOffered: builder.query({
            query: () => '/service-offerings',
            providesTags: ['Service'],
        }),

        getPlatformFeeOnPrice: builder.query({
            query: ({ price }) => ({
                url: `/platform-fee?price=${price}`,
            }),
        }),

        getPublishedSpecialists: builder.query({
            query: ({ page = 1, limit = 10, search = '', sortBy }) => {
                const params = new URLSearchParams()
                if (page) params.append('page', page.toString())
                if (limit) params.append('limit', limit.toString())
                if (search) params.append('search', search)
                if (sortBy) params.append('sort_by', sortBy)
                    
                return ({
                    url: `/specialists/public?${params.toString()}`,
                })
            },
            providesTags: ['PublishedSpecialist'],
        }),
    }),
});

export const {
    useGetSpecialistsQuery,
    useCreateSpecialistMutation,
    useExportSpecialistsMutation,
    useGetSingleSpecialistQuery,
    useDeleteSpecialistMutation,
    useUpdateSpecialistMutation,

    useGetServicesOfferedQuery,
    useGetPlatformFeeOnPriceQuery,
    useLazyGetPlatformFeeOnPriceQuery,

    useGetPublishedSpecialistsQuery,
} = specialistApi;
