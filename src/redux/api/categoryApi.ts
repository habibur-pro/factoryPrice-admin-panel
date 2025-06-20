import baseApi from "../baseApi";
import { tagTypes } from "../taglist";

const ENDPOINT = "/categories";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // user sign-up api endpoint
    addCategory: build.mutation({
      query: (data) => ({
        url: `${ENDPOINT}/create`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.CATEGORY],
    }),

    // get all categories
    getAllCategory: build.query({
      query: () => ({
        url: `${ENDPOINT}/getAll`,
        method: "GET",
      }),
      providesTags: [tagTypes.CATEGORY],
    }),
    getSubcategory: build.query({
      query: (catName: string) => ({
        url: `${ENDPOINT}/${catName}/subcategories`,
        method: "GET",
      }),
      providesTags: [tagTypes.CATEGORY],
    }),
  }),
});

export const {
  useGetAllCategoryQuery,
  useAddCategoryMutation,
  useGetSubcategoryQuery,
} = authApi;
