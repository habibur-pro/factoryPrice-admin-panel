import baseApi from "../baseApi";
import { tagTypes } from "../taglist";

const ENDPOINT = "/custom-orders";

export const customerOrderLinkApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // get all orders
    customerOrderLink: build.mutation({
      query: (data: any) => ({
        url: `${ENDPOINT}/custom-order-link`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.ORDER],
    }),
  }),
});

export const {
  useCustomerOrderLinkMutation
} = customerOrderLinkApi;
