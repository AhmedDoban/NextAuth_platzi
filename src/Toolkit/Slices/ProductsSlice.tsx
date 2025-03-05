import baseQuery from "@/Toolkit/baseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const ProductsSlice = createApi({
  reducerPath: "ProductsSlice",
  baseQuery,
  endpoints: (builder) => ({
    AllProducts: builder.query({
      query: (data: any) => ({
        url: "/",
        method: "GET",
        body: data,
      }),
    }),
  }),
});

export const { useAllProductsQuery } = ProductsSlice;
