import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AddColumns from "@/components/AddColumns";
import DisplayTable from "@/components/DisplayTable";
import NothingToDisplay from "@/components/NothingToDisplay";
import RequestChange from "@/components/RequestChange";
import Search from "@/components/Search";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { getAllSeriesFacts } from "@/lib/actions/seriesFact.actions";
import { getServerSession } from "next-auth";
import Link from "next/link";

const SeriesFact = async ({ searchParams }: { searchParams: { query: string; page?: number; limit?: number } }) => {
  const searchTerm = searchParams?.query || "";
  const page = searchParams?.page || 1;
  const limit = searchParams?.limit || 10;
  const { data: defaultParams } = await getDefaultParams();
  const {
    data: seriesFacts,
    totalPages,
    totalDocuments,
    completeData,
  } = await getAllSeriesFacts(limit, page, searchTerm, defaultParams[0]?.seriesFactsColumns);
  const notToRender = !defaultParams[0]?.seriesFactsColumns.length;

  const session = await getServerSession(authOptions);

  return (
    <main className="flex flex-col gap-1 w-full">
      <h1 className="text-4xl font-bold p-3 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">Series Fact</h1>
      {notToRender ? (
        <NothingToDisplay userId={session?.user.id!} />
      ) : (
        <>
          <div className="flex justify-between items-center gap-5 px-4 py-2 mt-2">
            <Search />
            <div className="flex gap-5">
              <Link href="/seriesFact/create">
                <Button>Create Series Fact</Button>
              </Link>
              {session?.user.isAdmin && <AddColumns userId={session.user.id} />}
              {!session?.user.isAdmin && <RequestChange />}
            </div>
          </div>
          {defaultParams.length ? (
            <DisplayTable
              columns={defaultParams[0].seriesFactsColumns}
              data={seriesFacts}
              type="Series Fact"
              totalPages={totalPages}
              totalDocuments={totalDocuments}
              completeData={completeData}
            />
          ) : (
            <TableSkeleton />
          )}
        </>
      )}
    </main>
  );
};

export default SeriesFact;
