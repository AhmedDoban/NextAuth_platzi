"use client";

import React from "react";
import { Formik, Form, Field, FormikHelpers, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Plus, Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useAllCategoriesQuery,
  useSingleProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
} from "@/Toolkit/Slices/ProductsSlice";
import ShowToast from "@/Toast/ShowToast";
import Link from "next/link";

export default function CreateUpdateProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const isEditMode = !!id;

  // Fetch product data if in edit mode
  const { data: product, isLoading: isLoadingProduct } = useSingleProductQuery(
    { id: Number(id) },
    { skip: !isEditMode || !id },
  );

  const [CreateProduct] = useCreateProductMutation();
  const [UpdateProduct] = useUpdateProductMutation();
  const { data: categories = [] } = useAllCategoriesQuery({});

  const handleSubmit = async (
    values: any,
    { resetForm }: FormikHelpers<any>,
  ) => {
    try {
      if (isEditMode) {
        await UpdateProduct({
          data: {
            ...values,
            price: Number(values.price),
          },
          id: Number(id),
        }).unwrap();
        ShowToast("success", "Product Updated Successfully");
      } else {
        await CreateProduct({
          ...values,
          price: Number(values.price),
          categoryId: Number(values.categoryId.id),
        }).unwrap();
        ShowToast("success", "Product Created Successfully");
        resetForm();
      }
      router.push("/products");
      router.refresh();
    } catch (error) {
      ShowToast(
        "error",
        `Failed to ${isEditMode ? "update" : "create"} product`,
      );
      console.error("Error:", error);
    }
  };

  // Loading state for edit mode
  if (isEditMode && isLoadingProduct) {
    return (
      <div className="container max-w-2xl mx-auto py-8">
        <div className="text-center">Loading product data...</div>
      </div>
    );
  }

  // Error state for edit mode when product not found
  if (isEditMode && !product) {
    return (
      <div className="container max-w-2xl mx-auto py-8">
        <div className="text-center text-red-500">Product not found</div>
        <div className="text-center mt-4">
          <Link href="/products">
            <Button variant="outline">Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <Link
        href="/products"
        className="inline-flex items-center mb-6 text-sm hover:underline"
      >
        ← Back to Products
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>
            {isEditMode ? "Edit Product" : "Create New Product"}
          </CardTitle>
          <CardDescription>
            {isEditMode
              ? "Update your product information"
              : "Fill in the details to add a new product"}
          </CardDescription>
        </CardHeader>

        <Formik
          initialValues={{
            title: product?.title || "",
            price: product?.price || "",
            description: product?.description || "",
            categoryId: product?.categoryId
              ? { id: product.categoryId, name: "Selected" }
              : { id: -1, name: "Select Category" },
            images: product?.images?.length ? product.images : [""],
          }}
          validationSchema={Yup.object({
            title: Yup.string().required("Title is required"),
            price: Yup.number()
              .positive("Price must be positive")
              .required("Price is required"),
            description: Yup.string().required("Description is required"),
            categoryId: Yup.object().required("Category is required"),
            images: Yup.array()
              .of(Yup.string().url("Must be a valid URL"))
              .min(1, "At least one image is required"),
          })}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Title *
                  </label>
                  <Field
                    type="text"
                    name="title"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="title"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Price *
                  </label>
                  <Field
                    type="number"
                    name="price"
                    step="0.01"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="price"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Category *
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="w-full px-3 py-2 text-start border rounded-lg bg-white">
                      {values.categoryId.name || "Select a Category"}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                      <DropdownMenuLabel>Categories</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {categories && categories.length > 0 ? (
                        categories.map((cat: any) => (
                          <DropdownMenuItem
                            key={cat.id}
                            onClick={() => setFieldValue("categoryId", cat)}
                          >
                            {cat.name}
                          </DropdownMenuItem>
                        ))
                      ) : (
                        <DropdownMenuItem disabled>
                          No categories available
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <ErrorMessage
                    name="categoryId"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description *
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    rows={4}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="description"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Image URLs
                  </label>
                  {values.images &&
                    values.images.map((_: any, index: number) => (
                      <div key={index} className="flex gap-2 mt-2">
                        <Field
                          type="url"
                          name={`images.${index}`}
                          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="https://example.com/image.jpg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (values.images.length > 1) {
                              const newImages = values.images.filter(
                                (_: any, i: number) => i !== index,
                              );
                              setFieldValue("images", newImages);
                            }
                          }}
                          className="bg-red-500 text-white px-3 rounded-lg hover:bg-red-600 disabled:opacity-50"
                          disabled={values.images.length === 1}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  <button
                    type="button"
                    onClick={() =>
                      setFieldValue("images", [...(values.images || []), ""])
                    }
                    className="mt-2 w-full bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                  >
                    <Plus size={18} className="inline mr-1" /> Add Image
                  </button>
                  <ErrorMessage
                    name="images"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </CardContent>

              <CardFooter className="flex justify-end gap-2">
                <Link href="/products">
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit">
                  {isEditMode ? "Save Changes" : "Create Product"}
                </Button>
              </CardFooter>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
}
