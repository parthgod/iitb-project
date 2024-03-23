import DisplayTable from "@/components/DisplayTable";
import RequestChange from "@/components/RequestChange";
import Search from "@/components/Search";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { getAllBuses } from "@/lib/actions/bus.actions";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import Link from "next/link";

const Bus = async ({ searchParams }: { searchParams: { query: string; page?: number; limit?: number } }) => {
  const searchTerm = searchParams?.query || "";
  const page = searchParams?.page || 1;
  const limit = searchParams?.limit || 10;
  const { data: defaultParams } = await getDefaultParams();
  const {
    data: buses,
    totalPages,
    totalDocuments,
    completeData,
  } = await getAllBuses(limit, page, searchTerm, defaultParams[0]?.busColumns);

  const session = await getServerSession(authOptions);

  return (
    <main className="flex flex-col w-full">
      <h1 className="text-4xl font-bold p-3">Bus</h1>
      <div className="flex justify-between items-center gap-5 px-4 py-2 mt-2">
        <Search />
        <div className="flex gap-5">
          <Link href="/bus/create">
            <Button>Create bus</Button>
          </Link>
          {!session?.user.isAdmin && <RequestChange userId={session?.user.id!} />}
        </div>
      </div>
      {defaultParams.length ? (
        <DisplayTable
          columns={defaultParams[0].busColumns}
          data={buses}
          type="Bus"
          totalPages={totalPages}
          totalDocuments={totalDocuments}
          completeData={completeData}
          session={session!}
        />
      ) : (
        <TableSkeleton />
      )}
    </main>
  );
};

export default Bus;
