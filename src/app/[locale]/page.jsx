import { ProductsTable } from "./(Auth)/Dashboard/ProductsTable";
import Header from "@/components/Header/Header";
import useFetchData from "@/Hooks/useFetchData";
import { getTranslations } from "next-intl/server";

const getAllProducts = async () => {
  const response = await useFetchData({ endpoint: "/products" });
  return response;
};
const Page = async ({ params }) => {
  const { locale } = params;
  const Translate = await getTranslations();
  const data = await getAllProducts();

  return (
    <div className="relative">
      <Header />
      <div className="container content-Container">
        <div className="flex justify-between">
          <h1 className="font-bold text-[20px]">{Translate("Title")}</h1>
        </div>
        <ProductsTable Products={data} />
      </div>
    </div>
  );
};

export default Page;
