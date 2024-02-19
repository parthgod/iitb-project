import AddColumns from "@/components/AddColumns";
import RequestChange from "@/components/RequestChange";
import DisplayTable from "@/components/DisplayTable";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import Link from "next/link";
import Search from "@/components/Search";
import { getAllWarehouses } from "@/lib/actions/warehouse.actions";
import DownloadTable from "@/components/DownloadTable";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const Warehouses = async ({ searchParams }: any) => {
  const searchTerm = searchParams.query || "";
  const { data: defaultParams } = (await getDefaultParams()) as any;
  const { data: warehouses } = (await getAllWarehouses()) as any;

  const session = await getServerSession(authOptions);

  const filteredwarehouses = searchTerm
    ? warehouses.filter((item: any) => {
        return JSON.stringify(item).replace("additionalFields", "")?.toLowerCase().includes(searchTerm.toLowerCase());
      })
    : warehouses;

  return (
    <main className="flex flex-col gap-3 w-full">
      <h1 className="text-4xl font-bold">Warehouses</h1>
      <div className="flex justify-between items-center gap-5 mb-2">
        <Search />
        <div className="flex gap-5">
          {session?.user?.isAdmin && (
            <Link href="/warehouses/create">
              <Button>Create warehouse</Button>
            </Link>
          )}
          {session?.user.isAdmin && <AddColumns />}
          {!session?.user.isAdmin && <RequestChange />}
        </div>
      </div>
      {defaultParams.length ? (
        <>
          <DisplayTable
            columns={defaultParams[0].warehouseColumns}
            data={filteredwarehouses}
            type="Warehouse"
          />
          <DownloadTable
            columns={defaultParams[0].warehouseColumns}
            data={filteredwarehouses}
            type="Warehouse"
          />
        </>
      ) : (
        <TableSkeleton />
      )}
    </main>
  );
};

export default Warehouses;
