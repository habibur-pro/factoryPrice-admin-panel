import baseApi from "../baseApi";
import { tagTypes } from "../taglist";

const ENDPOINT = "/reports";

export const reportApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // user sign-up api endpoint
    getFullReport: build.query({
      query: () => ({
        url: `${ENDPOINT}`,
        method: "GET",
      }),
      providesTags: [tagTypes.REPORT],
    }),
  }),
});

export const { useGetFullReportQuery } = reportApi;
