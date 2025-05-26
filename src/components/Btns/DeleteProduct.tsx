import { useDeleteProductMutation } from "@/Toolkit/Slices/ProductsSlice";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

function DeleteProduct({ id }: { id: number }) {
  const [deleteProduct] = useDeleteProductMutation();
  const router = useRouter();

  const HandleDelete = async () => {
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
            Swal.fire({
              title: "Product Deleted!",
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            });
            router.refresh();
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
  return (
    <button onClick={() => HandleDelete()}>
      <Trash size={18} />
    </button>
  );
}
export default DeleteProduct;
