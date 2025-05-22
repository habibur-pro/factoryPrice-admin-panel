import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { tagTypeList } from "./taglist";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.API_URL as string,
  }),
  endpoints: () => ({}),
  tagTypes: tagTypeList,
});
export default baseApi;
