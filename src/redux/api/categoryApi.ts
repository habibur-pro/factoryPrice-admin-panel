import baseApi from "../baseApi";
import { tagTypes } from "../taglist";

const ENDPOINT = "/categories";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTopLevelCategories: build.query({
      query: () => "categories/top",
      providesTags: [tagTypes.CATEGORY],
    }),

    // Get child categories of a parent
    getChildCategories: build.query({
      query: (parentId: string) => `categories/children?parentId=${parentId}`,
      providesTags: [tagTypes.CATEGORY],
    }),

    getCategoryPath: build.query({
      query: (categoryId) => `categories/path/${categoryId}`,
    }),

    // Add new category (can be top-level or subcategory)
    addCategory: build.mutation({
      query: (body) => {
        console.log("from redux create category",body)
        return {
          url: "categories/create",
          method: "POST",
          body,
        };
      },
      invalidatesTags: [tagTypes.CATEGORY],
    }),
    // user sign-up api endpoint
    // addCategory: build.mutation({
    //   query: (data) => ({
    //     url: `${ENDPOINT}/create`,
    //     method: "POST",
    //     body: data,
    //   }),
    //   invalidatesTags: [tagTypes.CATEGORY],
    // }),

    // get all categories
    // getAllCategory: build.query({
    //   query: () => ({
    //     url: `${ENDPOINT}/getAll`,
    //     method: "GET",
    //   }),
    //   providesTags: [tagTypes.CATEGORY],
    // }),
    // getSubcategory: build.query({
    //   query: (catName: string) => ({
    //     url: `${ENDPOINT}/${catName}/subcategories`,
    //     method: "GET",
    //   }),
    //   providesTags: [tagTypes.CATEGORY],
    // }),
  }),
});

export const {
  useAddCategoryMutation,
  useGetChildCategoriesQuery,
  useGetTopLevelCategoriesQuery,
  useGetCategoryPathQuery,
} = categoryApi;
