import AddColumns from "@/components/AddColumns";
import DisplayTable from "@/components/DisplayTable";
import RequestChange from "@/components/RequestChange";
import Search from "@/components/Search";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { getAllProducts } from "@/lib/actions/product.actions";
import Link from "next/link";

const Products = async ({ searchParams }: any) => {
  const searchTerm = searchParams.query || "";
  const { data: defaultParams } = (await getDefaultParams()) as any;
  const { data: products } = (await getAllProducts()) as any;

  const filteredProducts = searchTerm
    ? products.filter((item: any) => {
        return JSON.stringify(item).replace("additionalFields", "")?.toLowerCase().includes(searchTerm.toLowerCase());
      })
    : products;

  return (
    <main className="flex flex-col gap-3 w-full">
      <h1 className="text-4xl font-bold">Products</h1>
      <div className="flex justify-between items-center gap-5">
        <Search />
        <div className="flex gap-5">
          <Link href="/products/create">
            <Button>Create Product</Button>
          </Link>
          <AddColumns />
          <RequestChange />
        </div>
      </div>
      {defaultParams.length ? (
        <DisplayTable
          columns={defaultParams[0].productColumns}
          data={filteredProducts}
          type="Product"
        />
      ) : (
        <TableSkeleton />
      )}
    </main>
  );
};

export default Products;
