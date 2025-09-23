import baseApi from "../baseApi";
import { tagTypes } from "../taglist";

const ENDPOINT = "/countries";

export const countryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // user sign-up api endpoint
    addCountry: build.mutation({
      query: (data: any) => ({
        url: `${ENDPOINT}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.COUNTRY],
    }),
    getCountries: build.query({
      query: () => ({
        url: `${ENDPOINT}`,
        method: "GET",
      }),
      providesTags: [tagTypes.COUNTRY],
    }),
    updateCountry: build.mutation({
      query: (payload: { countryId: string; data: any }) => ({
        url: `${ENDPOINT}/${payload.countryId}`,
        method: "PATCH",
        body: payload.data,
      }),
      invalidatesTags: [tagTypes.COUNTRY],
    }),
    deleteCountry: build.mutation({
      query: (countryId: string) => ({
        url: `${ENDPOINT}/${countryId}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.COUNTRY],
    }),
  }),
});

export const {
  useAddCountryMutation,
  useDeleteCountryMutation,
  useUpdateCountryMutation,
  useGetCountriesQuery,
} = countryApi;
