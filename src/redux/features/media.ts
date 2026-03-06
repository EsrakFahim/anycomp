import { apiSlice } from "../api/apiSlice";

const media = apiSlice.injectEndpoints({
      endpoints: (builder) => ({
            uploadMedia: builder.mutation({
                  query: (formData) => ({
                        url: '/media/upload',
                        method: 'POST',
                        body: formData,
                  }),
            }),
      }),
});

export const { useUploadMediaMutation } = media;