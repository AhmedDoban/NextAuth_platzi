"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pencil, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSingleProductQuery } from "@/Toolkit/Slices/ProductsSlice";
import DeleteProduct from "@/components/Btns/DeleteProduct";

function ViewProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const {
    data: product,
    isLoading,
    error,
  } = useSingleProductQuery({ id: Number(id) }, { skip: !id });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price || 0);
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-muted-foreground">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <p className="text-red-500 text-lg">Product not found</p>
              <Link href="/products">
                <Button className="mt-4" variant="outline">
                  <ArrowLeft size={16} className="mr-2" />
                  Back to Products
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8">
      {/* Back Button */}
      <Link
        href="/products"
        className="inline-flex items-center mb-6 text-sm hover:underline"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to Products
      </Link>

      <Card className="overflow-hidden">
        {/* Product Images Gallery */}
        {product.images && product.images.length > 0 && (
          <div className="bg-gray-50 border-b">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
              {product.images.map((image: string, index: number) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden bg-white shadow-sm"
                >
                  <img
                    src={image}
                    alt={`${product.title} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/400x400?text=No+Image";
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-3xl mb-2">{product.title}</CardTitle>
              <CardDescription className="text-4xl font-bold text-primary">
                {formatPrice(product.price)}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Link href={`/products/create-update?id=${product.id}`}>
                <Button variant="outline" className="text-blue-600">
                  <Pencil size={16} className="mr-2" />
                  Edit
                </Button>
              </Link>
              <DeleteProduct id={product.id} />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Description</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-muted-foreground whitespace-pre-wrap">
                {product.description || "No description available"}
              </p>
            </div>
          </div>

          {/* Product Details */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Product Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Product ID</p>
                <p className="font-medium">{product.id}</p>
              </div>
              {product.categoryId && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">
                    Category ID
                  </p>
                  <p className="font-medium">{product.categoryId}</p>
                </div>
              )}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <p className="font-medium text-green-600">Active</p>
              </div>
            </div>
          </div>

          {/* Additional Info if available */}
          {product.email && (
            <div>
              <h3 className="text-lg font-semibold mb-3">
                Contact Information
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-muted-foreground">
                  <span className="font-medium">Email:</span> {product.email}
                </p>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="border-t bg-gray-50/50 flex justify-between">
          <div className="text-sm text-muted-foreground">
            Created at: {new Date().toLocaleDateString()}
          </div>
          <div className="flex gap-2">
            <Link href="/products">
              <Button variant="outline">Back to Products</Button>
            </Link>
            <Link href={`/products/create-update?id=${product.id}`}>
              <Button>
                <Pencil size={16} className="mr-2" />
                Edit Product
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default ViewProductPage;
