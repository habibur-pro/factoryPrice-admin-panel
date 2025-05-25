import baseApi from "../baseApi";
import { tagTypes } from "../taglist";

const BASE_URL = "/product";

export const productApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // user sign-up api endpoint
    addProduct: build.mutation({
      query: (data) => ({
        url: `${BASE_URL}/add-product`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.PRODUCT],
    }),

    // get all categories
    getAllProduct: build.query({
      query: () => ({
        url: `${BASE_URL}`,
        method: "GET",
      }),
      providesTags: [tagTypes.PRODUCT],
    }),
  }),
});

export const { useAddProductMutation, useGetAllProductQuery } = productApi;
