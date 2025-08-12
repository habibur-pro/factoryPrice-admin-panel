import baseApi from "../baseApi";
import { tagTypes } from "../taglist";

const ENDPOINT = "/discounts";

export const discountApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllDiscount: build.query({
      query: () => ENDPOINT,
      providesTags: [tagTypes.DISCOUNT],
    }),

   
    // Add new DISCOUNT
    addDiscount: build.mutation({
      query: (body) => {
        console.log("from redux create category",body)
        return {
          url: `${ENDPOINT}/create`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: [tagTypes.DISCOUNT],
    }),
    
  }),
});

export const {
  useAddDiscountMutation,
  useGetAllDiscountQuery
} = discountApi;
