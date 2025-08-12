import baseApi from "../baseApi";
import { tagTypes } from "../taglist";

const ENDPOINT = "/users";

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllUser: build.query({
      query: (params?: any) => ({
        url: `${ENDPOINT}`,
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.USER],
    }),

    updateUser: build.mutation({
      query: (userData) => {
        console.log("user data", userData);
        return {
          url: `${ENDPOINT}/update-profile/${userData.id}`,
          method: "PATCH",
          body: userData,
        };
      },
      invalidatesTags: [tagTypes.USER],
    }),

    getUserById: build.query({
      query: (id?: any) => ({
        url: `${ENDPOINT}/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.USER],
    }),

    searchUsers: build.query({
      query: (key?: any) => ({
        url: `${ENDPOINT}/search-users`,
        method: "GET",
        params: { key },
      }),
      providesTags: [tagTypes.USER],
    }),

    getAddresses: build.query({
      query: (userId?: any) => ({
        url: `${ENDPOINT}/${userId}/addresses`,
        method: "GET",
      }),
      providesTags: [tagTypes.ADDRESSES],
    }),
  }),
});

export const {
  useSearchUsersQuery,
  useGetAddressesQuery,
  useGetAllUserQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
} = userApi;
