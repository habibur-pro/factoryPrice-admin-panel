import baseApi from "../baseApi";

const BASE_URL = "/file-uploader";

export const fileUploaderApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // user sign-up api endpoint
    uploadFile: build.mutation({
      query: (orderData) => ({
        url: `${BASE_URL}/upload`,
        method: "POST",
        body: orderData,
      }),
    }),
  }),
});

export const { useUploadFileMutation } = fileUploaderApi;
