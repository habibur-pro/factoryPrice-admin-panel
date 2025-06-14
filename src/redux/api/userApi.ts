import baseApi from "../baseApi";
import { tagTypes } from "../taglist";

const BASE_URL = "/users";

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // get all orders
    searchUsers: build.query({
      query: (key?: any) => ({
        url: `${BASE_URL}/search-users`,
        method: "GET",
        params: { key },
      }),
      providesTags: [tagTypes.USER],
    }),
    // get all orders
    getAddresses: build.query({
      query: (userId?: any) => ({
        url: `${BASE_URL}/${userId}/addresses`,
        method: "GET",
      }),
      providesTags: [tagTypes.ADDRESSES],
    }),
  }),
});

export const { useSearchUsersQuery, useGetAddressesQuery } = userApi;
