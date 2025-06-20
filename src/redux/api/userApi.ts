import baseApi from "../baseApi";
import { tagTypes } from "../taglist";

const ENDPOINT = "/users";

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // get all orders
    searchUsers: build.query({
      query: (key?: any) => ({
        url: `${ENDPOINT}/search-users`,
        method: "GET",
        params: { key },
      }),
      providesTags: [tagTypes.USER],
    }),
    // get all orders
    getAddresses: build.query({
      query: (userId?: any) => ({
        url: `${ENDPOINT}/${userId}/addresses`,
        method: "GET",
      }),
      providesTags: [tagTypes.ADDRESSES],
    }),
  }),
});

export const { useSearchUsersQuery, useGetAddressesQuery } = userApi;
