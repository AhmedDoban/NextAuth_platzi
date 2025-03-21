import baseQuery from "@/Toolkit/baseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const ProductsSlice = createApi({
  reducerPath: "ProductsSlice",
  baseQuery,
  endpoints: (builder) => ({
    AllCategories: builder.query({
      query: () => ({
        url: "/categories",
        method: "GET",
      }),
    }),
    AllProducts: builder.query({
      query: () => ({
        url: "/products",
        method: "GET",
      }),
    }),
    SingleProduct: builder.query({
      query: ({ id }) => ({
        url: `/products/${id}`,
        method: "GET",
      }),
    }),
    DeleteProduct: builder.mutation({
      query: (id: number) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
    }),
    CreateProduct: builder.mutation({
      query: (data: any) => ({
        url: `/products`,
        method: "POST",
        body: data,
      }),
    }),
    UpdateProduct: builder.mutation({
      query: ({ data, id }: { data: any; id: number }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useAllProductsQuery,
  useSingleProductQuery,
  useDeleteProductMutation,
  useCreateProductMutation,
  useUpdateProductMutation,
  useAllCategoriesQuery,
} = ProductsSlice;
