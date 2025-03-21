"use client";
import {
  useAllProductsQuery,
  useDeleteProductMutation,
} from "@/Toolkit/Slices/ProductsSlice";
import { ProductsTable } from "./(Auth)/Dashboard/ProductsTable";
import { useTranslations } from "use-intl";
import LoaderFetchData from "@/components/Loaders/LoaderFetchData";
import Swal from "sweetalert2";
import { useState } from "react";
import CreateModel from "./(Auth)/Dashboard/CreateModel";
import { useSearchParams, useRouter } from "next/navigation";
import UpdateModel from "./(Auth)/Dashboard/UpdateModel";
import Header from "@/components/Header/Header";

const Page = ({ params }) => {
  const { locale } = params;
  const Translate = useTranslations();
  const [CreateOpen, setCreateOpen] = useState(false);
  const [UpdateOpen, setUpdateOpen] = useState(false);
  const { data, isLoading, isError, refetch } = useAllProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();
  const searchParams = useSearchParams();
  const router = useRouter();

  const HandleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete!",
      customClass: {
        popup: "custom-popup",
        confirmButton: "custom-confirm-button",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteProduct(id).unwrap();
          if (res) {
            await refetch();
            Swal.fire({
              title: "Product Deleted!",
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: "Failed to delete product.",
            icon: "error",
          });
        }
      }
    });
  };

  const closeUpdateModel = () => {
    setUpdateOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("id");
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="relative">
      <Header />
      <div className="container content-Container">
        {isLoading ? (
          <LoaderFetchData />
        ) : (
          <>
            <div className="flex justify-between">
              <h1 className="font-bold text-[20px]">{Translate("Title")}</h1>
              <button
                className="bg-black text-white px-4 py-2 rounded-md cursor-pointer text-[14px] hover:bg-gray-700"
                onClick={() => setCreateOpen(true)}
              >
                Create product
              </button>
            </div>
            <ProductsTable
              Products={data}
              HandleDlete={HandleDelete}
              setUpdateOpen={setUpdateOpen}
            />
          </>
        )}
        <CreateModel
          modalIsOpen={CreateOpen}
          SetModel={() => setCreateOpen(false)}
          refetch={refetch}
        />
        {searchParams.get("id") && (
          <UpdateModel
            modalIsOpen={UpdateOpen}
            SetModel={closeUpdateModel}
            refetch={refetch}
            id={searchParams.get("id")}
          />
        )}
      </div>
    </div>
  );
};

export default Page;
