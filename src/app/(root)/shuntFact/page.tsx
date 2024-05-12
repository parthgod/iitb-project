import DisplayTable from "@/components/DisplayTable";
import NothingToDisplay from "@/components/NothingToDisplay";
import RequestChange from "@/components/RequestChange";
import Search from "@/components/Search";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { getAllShuntFacts } from "@/lib/actions/shuntFact.actions";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { FaPlus } from "react-icons/fa6";

const ShuntFact = async ({ searchParams }: { searchParams: { query: string; page?: number; limit?: number } }) => {
  const searchTerm = searchParams?.query || "";
  const page = searchParams?.page || 1;
  const limit = searchParams?.limit || 20;
  const { data: defaultParams } = await getDefaultParams();
  const {
    data: shuntFacts,
    totalPages,
    totalDocuments,
    completeData,
  } = await getAllShuntFacts(limit, page, searchTerm, defaultParams[0]?.shuntFactsColumns);
  const notToRender = !defaultParams[0]?.shuntFactsColumns.length;

  const session = await getServerSession(authOptions);

  return (
    <main className="flex flex-col w-full">
      <h1 className="text-4xl font-bold p-3">Shunt Fact</h1>
      {notToRender ? (
        <NothingToDisplay userId={session?.user.id!} />
      ) : (
        <>
          <div className="flex justify-between items-center gap-5 px-4 py-2 mt-2">
            <Search />
            <div className="flex gap-5">
              <Link href={`/shuntFact/create`}>
                <Button>
                  Create shunt Fact <FaPlus className="text-lg ml-2" />
                </Button>
              </Link>
              {!session?.user.isAdmin && <RequestChange userId={session?.user.id!} />}
            </div>
          </div>
          {defaultParams.length ? (
            <DisplayTable
              columns={defaultParams[0].shuntFactsColumns}
              data={shuntFacts}
              type="Shunt Fact"
              totalPages={totalPages}
              totalDocuments={totalDocuments}
              completeData={completeData}
              session={session!}
              page={page}
            />
          ) : (
            <TableSkeleton />
          )}
        </>
      )}
    </main>
  );
};

export default ShuntFact;
