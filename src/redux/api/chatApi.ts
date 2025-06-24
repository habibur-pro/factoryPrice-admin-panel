import baseApi from "../baseApi";
import { tagTypes } from "../taglist";

const ENDPOINT = "/chats";

export const chatApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // user sign-up api endpoint
    replay: build.mutation({
      query: (payload: { chatId: string; data: any }) => ({
        url: `${ENDPOINT}/${payload.chatId}/replay`,
        method: "POST",
        body: payload.data,
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

export const { useReplayMutation, useGetChatQuery } = chatApi;
