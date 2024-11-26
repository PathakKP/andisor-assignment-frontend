import { getProducts } from "@/services/api";
import ProductTable from "./ProductTable";
import { Suspense } from "react";

export default async function HomePage() {
  const page = 1;
  const limit = 5;
  const response = await getProducts(page, limit);
  const products = response.data;

  console.log("products", response);

  return (
    <div className="p-4 h-full">
      <h1>Inventory</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <ProductTable products={products} />
      </Suspense>
      {/* <button onClick={() => setPage((prev) => prev + 1)}>Next Page</button> */}
    </div>
  );
}
