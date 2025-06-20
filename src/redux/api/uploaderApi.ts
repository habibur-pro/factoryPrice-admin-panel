import baseApi from "../baseApi";

const ENDPOINT = "/file-uploader";

export const fileUploaderApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // user sign-up api endpoint
    uploadFile: build.mutation({
      query: (orderData) => ({
        url: `${ENDPOINT}/upload`,
        method: "POST",
        body: orderData,
      }),
    }),
  }),
});

export const { useUploadFileMutation } = fileUploaderApi;
