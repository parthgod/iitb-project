import DisplayTable from "@/components/DisplayTable";
import RequestChange from "@/components/RequestChange";
import Search from "@/components/Search";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { getAllLoads } from "@/lib/actions/load.actions";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { FaPlus } from "react-icons/fa6";

const Loads = async ({ searchParams }: { searchParams: { query: string; page?: number; limit?: number } }) => {
  const searchTerm = searchParams?.query || "";
  const page = searchParams?.page || 1;
  const limit = searchParams?.limit || 10;
  const { data: defaultParams } = await getDefaultParams();
  const {
    data: loads,
    totalPages,
    totalDocuments,
    completeData,
  } = await getAllLoads(limit, page, searchTerm, defaultParams[0]?.loadsColumns);

  const session = await getServerSession(authOptions);

  const filteredLoads = searchTerm
    ? loads.filter((item) => {
        return JSON.stringify(item)
          .replace("additionalFields", "")
          .replace(new RegExp(defaultParams[0].loadsColumns.map((item) => item.field).join("|"), "g"), "")
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
      })
    : loads;

  return (
    <main className="flex flex-col w-full">
      <h1 className="text-4xl font-bold p-3">Loads</h1>
      <div className="flex justify-between items-center gap-5 px-4 py-2 mt-2">
        <Search />
        <div className="flex gap-5">
          <Link href="/load/create">
            <Button>
              Create load <FaPlus className="text-lg ml-2" />
            </Button>
          </Link>
          {!session?.user.isAdmin && <RequestChange userId={session?.user.id!} />}
        </div>
      </div>
      {defaultParams.length ? (
        <DisplayTable
          columns={defaultParams[0].loadsColumns}
          data={filteredLoads}
          type="Load"
          totalPages={totalPages}
          totalDocuments={totalDocuments}
          completeData={completeData}
          session={session!}
          page={page}
        />
      ) : (
        <TableSkeleton />
      )}
    </main>
  );
};

export default Loads;
