import baseApi from "../baseApi";
import { tagTypes } from "../taglist";

const ENDPOINT = "/orders";

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
        url: `${ENDPOINT}`,
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.ORDER],
    }),
    // get single order
    getOrder: build.query({
      query: (id: string) => ({
        url: `${ENDPOINT}/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.ORDER],
    }),
    placeCustomOrder: build.mutation({
      query: (data: any) => ({
        url: `${ENDPOINT}/place-custom-order`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.ORDER],
    }),
    updateOrder: build.mutation({
      query: (data: any) => ({
        url: `${ENDPOINT}/${data.id}/update-order`,
        method: "POST",
        body: data.payload,
      }),
      invalidatesTags: [tagTypes.ORDER],
    }),
    updatePayment: build.mutation({
      query: (data: any) => ({
        url: `${ENDPOINT}/${data.id}/update-payment`,
        method: "POST",
        body: data.payload,
      }),
      invalidatesTags: [tagTypes.ORDER, tagTypes.TIMELINE],
    }),
    getTimeLines: build.query({
      query: (orderId: string) => ({
        url: `${ENDPOINT}/${orderId}/timeline`,
        method: "GET",
      }),
      providesTags: [tagTypes.TIMELINE],
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useGetOrderQuery,
  usePlaceCustomOrderMutation,
  useUpdateOrderMutation,
  useUpdatePaymentMutation,
  useGetTimeLinesQuery,
} = orderApi;
