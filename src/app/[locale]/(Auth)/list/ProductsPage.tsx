"use client";

import React, { useState } from "react";
import { Pencil, Plus, Search, X, Eye } from "lucide-react";
import ResponsivePagination from "react-responsive-pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import DeleteProduct from "@/components/Btns/DeleteProduct";

type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  categoryId: number;
};

function ProductsPage({ Products = [] }: { Products?: Product[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Filter products
  const filteredProducts = React.useMemo(() => {
    if (!Products || Products.length === 0) return [];
    if (!searchTerm.trim()) return Products;
    return Products.filter((product) =>
      product.title?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [Products, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price || 0);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 py-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        <Link href="/products/create-update">
          <Button>
            <Plus size={16} className="mr-2" />
            Create Product
          </Button>
        </Link>
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-muted-foreground">
        Showing {currentProducts.length} of {filteredProducts.length} products
      </div>

      {/* Products Grid */}
      {currentProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentProducts.map((product) => (
              <Card
                key={product.id}
                className="hover:shadow-lg transition-shadow flex flex-col"
              >
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-1">
                    {product.title}
                  </CardTitle>
                  <CardDescription className="text-2xl font-bold text-primary">
                    {formatPrice(product.price)}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {product.description || "No description available"}
                  </p>
                  {product.images && product.images[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="mt-3 w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  )}
                </CardContent>

                <CardFooter className="flex justify-end gap-2">
                  <Link href={`/products/view/${product.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye size={16} className="mr-1" />
                      View
                    </Button>
                  </Link>

                  <Link href={`/products/create-update?id=${product.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-600"
                    >
                      <Pencil size={16} className="mr-1" />
                      Edit
                    </Button>
                  </Link>

                  <DeleteProduct id={product.id} />
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center py-8">
              <ResponsivePagination
                current={currentPage}
                total={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
                className="flex w-fit list-none justify-center gap-2 p-0"
                pageItemClassName="flex items-center justify-center min-w-[32px] min-h-[32px] rounded-md text-[14px] font-normal transition hover:bg-gray-100 cursor-pointer"
                pageLinkClassName="w-full h-full flex items-center justify-center"
                activeItemClassName="font-bold bg-gray-100 text-black"
                disabledItemClassName="bg-gray-50 text-gray-400 pointer-events-none cursor-auto"
                previousClassName="px-3 py-1 rounded-md transition border"
                nextClassName="px-3 py-1 rounded-md transition border"
                previousLabel="Previous"
                nextLabel="Next"
              />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found.</p>
          <Link href="/products/create-update">
            <Button className="mt-4">
              <Plus size={16} className="mr-2" />
              Create your first product
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default ProductsPage;
