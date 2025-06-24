import baseApi from "../baseApi";
import { tagTypes } from "../taglist";

const ENDPOINT = "/subcategories";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // user sign-up api endpoint
    addSubcategory: build.mutation({
      query: (data) => ({
        url: `${ENDPOINT}/create`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.SUBCATEGORY, tagTypes.CATEGORY],
    }),

    // get all categories
    getAllSubcategory: build.query({
      query: () => ({
        url: `${ENDPOINT}/getAll`,
        method: "GET",
      }),
      providesTags: [tagTypes.SUBCATEGORY],
    }),
  }),
});

export const { useGetAllSubcategoryQuery, useAddSubcategoryMutation } = authApi;
