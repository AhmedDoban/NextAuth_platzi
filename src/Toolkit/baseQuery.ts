import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getCookie } from "cookies-next";

const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_API}`,
  prepareHeaders: (headers) => {
    const token = getCookie("Template_Token");
    const language = getCookie("NEXT_LOCALE") || "en";
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Accept-Language", language as string);
    headers.set("Access-Control-Allow-Origin", "*");

    return headers;
  },
});

export default baseQuery;
