import AddColumns from "@/components/AddColumns";
import RequestChange from "@/components/RequestChange";
import DisplayTable from "@/components/DisplayTable";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { getAllVendors } from "@/lib/actions/vendor.actions";
import Link from "next/link";
import Search from "@/components/Search";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const Vendors = async ({ searchParams }: any) => {
  const session = await getServerSession();
  if (!session) {
    redirect("/login");
  }
  const searchTerm = searchParams.query || "";
  const { data: defaultParams } = (await getDefaultParams()) as any;
  const { data: vendors } = (await getAllVendors()) as any;

  const filteredVendors = searchTerm
    ? vendors.filter((item: any) => {
        return JSON.stringify(item).replace("additionalFields", "")?.toLowerCase().includes(searchTerm.toLowerCase());
      })
    : vendors;

  return (
    <main className="flex flex-col gap-3 w-full">
      <h1 className="text-4xl font-bold">Vendors</h1>
      <div className="flex justify-between items-center gap-5">
        <Search />
        <div className="flex gap-5">
          <Link href="/vendors/create">
            <Button>Create vendor</Button>
          </Link>
          <AddColumns />
          <RequestChange />
        </div>
      </div>
      {defaultParams.length ? (
        <DisplayTable
          columns={defaultParams[0].vendorColumns}
          data={filteredVendors}
          type="Vendor"
        />
      ) : (
        <TableSkeleton />
      )}
    </main>
  );
};

export default Vendors;
