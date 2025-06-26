import baseApi from "../baseApi";
import { tagTypes } from "../taglist";

const ENDPOINT = "/payments";

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // get all payments
    getAllPayment: build.query({
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
      providesTags: [tagTypes.PAYMENT],
    }),

    // get all categories
    getPayment: build.query({
      query: (slug: string) => ({
        url: `${ENDPOINT}/${slug}`,
        method: "GET",
      }),
      providesTags: [tagTypes.PAYMENT],
    }),
  }),
});

export const { useGetPaymentQuery, useGetAllPaymentQuery } = paymentApi;
