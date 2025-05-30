import baseApi from "../baseApi";
import { tagTypes } from "../taglist";

const BASE_URL = "/products";

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

    // get all categories
    getSingleProduct: build.query({
      query: (slug: string) => ({
        url: `${BASE_URL}/${slug}`,
        method: "GET",
      }),
      providesTags: [tagTypes.PRODUCT],
    }),
  }),
});

export const { useAddProductMutation, useGetAllProductQuery } = productApi;
