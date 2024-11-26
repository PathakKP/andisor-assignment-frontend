import { getProducts } from "@/services/api";
import ProductTable from "./ProductTable";
import { Suspense } from "react";
import Header from "./header";

export default async function HomePage() {
  const page = 1;
  const limit = 5;
  const response = await getProducts(page, limit);
  console.log("ressponse", response.data.products);

  const products = response.data.products;
  const totalProducts = response.data.total;

  return (
    <div className="h-full flex flex-col">
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        <ProductTable
          initialProducts={products}
          totalProducts={totalProducts}
          initialPage={page}
          pageSize={limit}
        />
      </Suspense>
    </div>
  );
}
