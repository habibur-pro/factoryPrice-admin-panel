import baseApi from "../baseApi";
import { tagTypes } from "../taglist";

const ENDPOINT = "/products";

export const productApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // user sign-up api endpoint
    addProduct: build.mutation({
      query: (data) => ({
        url: `${ENDPOINT}/add-product`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.PRODUCT],
    }),

    // get all categories
    getAllProduct: build.query({
      query: () => ({
        url: `${ENDPOINT}`,
        method: "GET",
      }),
      providesTags: [tagTypes.PRODUCT],
    }),

    // get all categories
    getSingleProduct: build.query({
      query: (slug: string) => ({
        url: `${ENDPOINT}/${slug}`,
        method: "GET",
      }),
      providesTags: [tagTypes.PRODUCT],
    }),
    searchProduct: build.query({
      query: (key?: any) => ({
        url: `${ENDPOINT}/search-products`,
        method: "GET",
        params: { key },
      }),
      providesTags: [tagTypes.PRODUCT],
    }),
  }),
});

export const {
  useAddProductMutation,
  useGetAllProductQuery,
  useSearchProductQuery,
} = productApi;
