import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AddColumns from "@/components/AddColumns";
import DisplayTable from "@/components/DisplayTable";
import RequestChange from "@/components/RequestChange";
import Search from "@/components/Search";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { getAllShuntCapacitors } from "@/lib/actions/shuntCapacitor.actions";
import { getServerSession } from "next-auth";
import Link from "next/link";

const ShuntCapacitor = async ({ searchParams }: { searchParams: { query: string } }) => {
  const searchTerm = searchParams.query || "";
  const { data: defaultParams } = await getDefaultParams();
  const { data: shuntCapacitors } = await getAllShuntCapacitors();

  const session = await getServerSession(authOptions);

  const filteredShuntCapacitors = searchTerm
    ? shuntCapacitors.filter((item) => {
        return JSON.stringify(item).replace("additionalFields", "")?.toLowerCase().includes(searchTerm.toLowerCase());
      })
    : shuntCapacitors;

  return (
    <main className="flex flex-col gap-3 w-full">
      <h1 className="text-4xl font-bold">Shunt Capacitor</h1>
      <div className="flex justify-between items-center gap-5 mb-2">
        <Search />
        <div className="flex gap-5">
          <Link href="/shuntCapacitor/create">
            <Button>Create shunt capacitor</Button>
          </Link>
          {session?.user.isAdmin && <AddColumns />}
          {!session?.user.isAdmin && <RequestChange />}
        </div>
      </div>
      {defaultParams.length ? (
        <DisplayTable
          columns={defaultParams[0].shuntCapacitorColumns}
          data={filteredShuntCapacitors}
          type="Shunt Capacitor"
        />
      ) : (
        <TableSkeleton />
      )}
    </main>
  );
};

export default ShuntCapacitor;
