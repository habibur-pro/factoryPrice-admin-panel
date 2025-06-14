import baseApi from "../baseApi";
import { tagTypes } from "../taglist";

const BASE_URL = "/orders";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // get all orders
    getAllOrders: build.query({
      query: (params?: {
        page?: number;
        limit?: number;
        status?: string;
        id?: string;
      }) => ({
        url: `${BASE_URL}`,
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.ORDER],
    }),
    // get single order
    getOrder: build.query({
      query: (id: string) => ({
        url: `${BASE_URL}/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.ORDER],
    }),
    placeCustomOrder: build.mutation({
      query: (data: any) => ({
        url: `${BASE_URL}/place-custom-order`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.ORDER],
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useGetOrderQuery,
  usePlaceCustomOrderMutation,
} = orderApi;
