import getBaseUrl from "@/lib/getBaseUrl";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { tagTypeList } from "./taglist";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: getBaseUrl() as string,
  }),
  endpoints: () => ({}),
  tagTypes: tagTypeList,
});
export default baseApi;
