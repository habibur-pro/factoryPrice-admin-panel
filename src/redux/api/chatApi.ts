import baseApi from "../baseApi";
import { tagTypes } from "../taglist";

const ENDPOINT = "/chats";

export const chatApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // user sign-up api endpoint
    send: build.mutation({
      query: (data) => ({
        url: `${ENDPOINT}/send`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.CHAT],
    }),
    getChat: build.query({
      query: (sessionId: string) => ({
        url: `${ENDPOINT}/${sessionId}/chats`,
        method: "GET",
      }),
      providesTags: [tagTypes.CHAT],
    }),
  }),
});

export const { useSendMutation, useGetChatQuery } = chatApi;
