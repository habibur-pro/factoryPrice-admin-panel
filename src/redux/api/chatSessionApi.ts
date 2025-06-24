import baseApi from "../baseApi";
import { tagTypes } from "../taglist";

const AUTH_URL = "/chat-sessions";

export const chatSessionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // user sign-up api endpoint
    getSessions: build.query({
      query: () => ({
        url: `${AUTH_URL}`,
        method: "GET",
      }),
      providesTags: [tagTypes.CHAT],
    }),
  }),
});

export const { useGetSessionsQuery } = chatSessionApi;
