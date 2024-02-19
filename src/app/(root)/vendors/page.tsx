import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AddColumns from "@/components/AddColumns";
import DisplayTable from "@/components/DisplayTable";
import RequestChange from "@/components/RequestChange";
import Search from "@/components/Search";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { getAllVendors } from "@/lib/actions/vendor.actions";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import Link from "next/link";

const Vendors = async ({ searchParams }: any) => {
  const searchTerm = searchParams.query || "";
  const { data: defaultParams } = (await getDefaultParams()) as any;
  const { data: vendors } = (await getAllVendors()) as any;

  const session = await getServerSession(authOptions);

  const filteredVendors = searchTerm
    ? vendors.filter((item: any) => {
        return JSON.stringify(item).replace("additionalFields", "")?.toLowerCase().includes(searchTerm.toLowerCase());
      })
    : vendors;

  return (
    <main className="flex flex-col gap-3 w-full">
      <h1 className="text-4xl font-bold">Vendors</h1>
      <div className="flex justify-between items-center gap-5 mb-2">
        <Search />
        <div className="flex gap-5">
          {session?.user?.isAdmin && (
            <Link href="/vendors/create">
              <Button>Create vendor</Button>
            </Link>
          )}
          {session?.user.isAdmin && <AddColumns />}
          {!session?.user.isAdmin && <RequestChange />}
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
