import { Formik, Form, Field, FormikHelpers, ErrorMessage } from "formik";
import * as Yup from "yup";
import Modal from "react-modal";
import { Plus, Trash2, X } from "lucide-react";
import {
  useAllCategoriesQuery,
  useCreateProductMutation,
} from "@/Toolkit/Slices/ProductsSlice";
import ShowToast from "@/Toast/ShowToast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function CreateModel({
  modalIsOpen,
  SetModel,
  refetch,
}: {
  modalIsOpen: boolean;
  SetModel: () => void;
  refetch: () => void;
}) {
  const [CreateProduct] = useCreateProductMutation();
  const { data, isLoading } = useAllCategoriesQuery({});

  return (
    !isLoading && (
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={SetModel}
        contentLabel="Create New Product"
        className="bg-white p-8  max-w-xl w-11/12 h-[90vh] overflow-hidden overflow-y-scroll mx-auto shadow-2xl relative transition-all"
        overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">
          Create New Product
        </h2>
        <Formik
          initialValues={{
            title: "",
            price: "",
            description: "",
            categoryId: { id: -1, name: "Select Category" },
            images: [""],
          }}
          validationSchema={Yup.object({
            title: Yup.string().required("Title is required"),
            price: Yup.number()
              .positive("Price must be positive")
              .required("Price is required"),
            description: Yup.string().required("Description is required"),
            categoryId: Yup.object().required("Category ID is required"),
            images: Yup.array()
              .of(Yup.string().url("Must be a valid URL"))
              .min(1, "At least one image is required"),
          })}
          onSubmit={async (values, { resetForm }: FormikHelpers<any>) => {
            const response = await CreateProduct({
              ...values,
              price: Number(values.price),
              categoryId: Number(values.categoryId.id),
            }).unwrap();

            ShowToast("success", "Product Created Successfully");
            refetch();
            SetModel();
            resetForm();
          }}
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-5">
              {[
                { label: "Title", type: "text", name: "title" },
                { label: "Price", type: "number", name: "price" },
              ].map(({ label, type, name }) => (
                <div key={name} className="relative w-full">
                  <label className="block text-sm font-medium text-gray-700">
                    {label}
                  </label>
                  <Field
                    type={type}
                    name={name}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm max-w-full"
                  />
                  <ErrorMessage
                    name={name}
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              ))}

              <div className="relative w-full">
                <DropdownMenu>
                  <DropdownMenuTrigger className=" w-full px-4 py-2 text-[14px] text-start bg-white dark:bg-gray-800 text-gray-700 dark:text-white rounded-lg shadow-sm border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
                    {values.categoryId.name || "Select a Category"}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md p-1">
                    <DropdownMenuLabel className="px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Category
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="border-gray-200 dark:border-gray-700" />
                    {data.map((el: any, index: number) => (
                      <DropdownMenuItem
                        key={index}
                        onClick={() => setFieldValue("categoryId", el)}
                        className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer transition-all"
                      >
                        {el.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <ErrorMessage
                  name={"categoryId"}
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <Field
                  as="textarea"
                  name="description"
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm max-w-full h-24 resize-none"
                />
                <ErrorMessage
                  name="description"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Image URLs
                </label>
                {values.images.map((_: any, index: any) => (
                  <div key={index} className="flex items-center space-x-3 mt-2">
                    <Field
                      type="url"
                      name={`images.${index}`}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm max-w-full"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (values.images.length > 1) {
                          const updatedImages = values.images.filter(
                            (_: any, i: number) => i !== index
                          );
                          setFieldValue("images", updatedImages);
                        }
                      }}
                      className="bg-red-500 text-white p-2 rounded-sm shadow-md hover:bg-red-600 transition duration-200"
                      disabled={values.images.length === 1}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setFieldValue("images", [...values.images, ""])
                  }
                  className="mt-3 text-sm w-full flex items-center justify-center bg-green-500 text-white px-4 py-2 rounded-sm shadow-md hover:bg-green-600 transition duration-200"
                >
                  <Plus size={18} className="mr-1" /> Add Image
                </button>
                <ErrorMessage
                  name="images"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-sm text-white py-3 rounded-sm font-semibold shadow-md hover:bg-blue-700 transition duration-200"
              >
                Submit
              </button>
            </Form>
          )}
        </Formik>
        <button
          onClick={SetModel}
          className="absolute top-4 right-4 bg-red-500 text-white w-8 h-8 flex items-center justify-center rounded-sm shadow-md hover:bg-red-600 transition duration-200"
        >
          <X size={20} />
        </button>
      </Modal>
    )
  );
}

export default CreateModel;
