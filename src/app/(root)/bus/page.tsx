import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AddColumns from "@/components/AddColumns";
import DisplayTable from "@/components/DisplayTable";
import RequestChange from "@/components/RequestChange";
import Search from "@/components/Search";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { getAllBuses } from "@/lib/actions/bus.actions";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { getLatestChange } from "@/lib/database/detectChanges";
import { getServerSession } from "next-auth";
import Link from "next/link";

const Bus = async ({ searchParams }: { searchParams: { query: string } }) => {
  const searchTerm = searchParams.query || "";
  const { data: defaultParams } = await getDefaultParams();
  const { data: buses } = await getAllBuses();
  getLatestChange();

  const session = await getServerSession(authOptions);

  const filteredBuses = searchTerm
    ? buses.filter((item) => {
        return JSON.stringify(item)
          .replace("additionalFields", "")
          .replace(new RegExp(defaultParams[0].busColumns.map((item) => item.field).join("|"), "g"), "")
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
      })
    : buses;

  return (
    <main className="flex flex-col gap-3 w-full">
      <h1 className="text-4xl font-bold">Bus</h1>
      <div className="flex justify-between items-center gap-5 mb-2">
        <Search />
        <div className="flex gap-5">
          <Link href="/bus/create">
            <Button>Create bus</Button>
          </Link>
          {session?.user.isAdmin && <AddColumns userId={session.user.id} />}
          {!session?.user.isAdmin && <RequestChange />}
        </div>
      </div>
      {defaultParams.length ? (
        <DisplayTable
          columns={defaultParams[0].busColumns}
          data={filteredBuses}
          type="Bus"
        />
      ) : (
        <TableSkeleton />
      )}
    </main>
  );
};

export default Bus;
