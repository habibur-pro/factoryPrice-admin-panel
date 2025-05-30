import baseApi from "../baseApi";
import { tagTypes } from "../taglist";

const BASE_URL = "/subcategories";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // user sign-up api endpoint
    addSubcategory: build.mutation({
      query: (data) => ({
        url: `${BASE_URL}/create`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.SUBCATEGORY, tagTypes.CATEGORY],
    }),

    // get all categories
    getAllSubcategory: build.query({
      query: () => ({
        url: `${BASE_URL}/getAll`,
        method: "GET",
      }),
      providesTags: [tagTypes.SUBCATEGORY],
    }),
  }),
});

export const { useGetAllSubcategoryQuery, useAddSubcategoryMutation } = authApi;
