import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AddColumns from "@/components/AddColumns";
import DisplayTable from "@/components/DisplayTable";
import NothingToDisplay from "@/components/NothingToDisplay";
import RequestChange from "@/components/RequestChange";
import Search from "@/components/Search";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { getAllIBRs } from "@/lib/actions/ibr.actions";
import { getServerSession } from "next-auth";
import Link from "next/link";

const IBR = async ({ searchParams }: { searchParams: { query: string; page?: number; limit?: number } }) => {
  const searchTerm = searchParams?.query || "";
  const page = searchParams?.page || 1;
  const limit = searchParams?.limit || 10;
  const { data: defaultParams } = await getDefaultParams();
  const {
    data: ibrs,
    totalPages,
    totalDocuments,
    completeData,
  } = await getAllIBRs(limit, page, searchTerm, defaultParams[0]?.ibrColumns);
  const notToRender = !defaultParams[0]?.ibrColumns.length;

  const session = await getServerSession(authOptions);

  return (
    <main className="flex flex-col w-full">
      <h1 className="text-4xl font-bold p-3">IBR</h1>
      {notToRender ? (
        <NothingToDisplay userId={session?.user.id!} />
      ) : (
        <>
          <div className="flex justify-between items-center gap-5 px-4 py-2 mt-2">
            <Search />
            <div className="flex gap-5">
              <Link href="/ibr/create">
                <Button className={`${notToRender ? "hidden" : ""}`}>Create IBR</Button>
              </Link>
              {session?.user.isAdmin && <AddColumns userId={session.user.id} />}
              {!session?.user.isAdmin && <RequestChange userId={session?.user.id!} />}
            </div>
          </div>
          {defaultParams.length ? (
            <DisplayTable
              columns={defaultParams[0].ibrColumns}
              data={ibrs}
              type="IBR"
              totalPages={totalPages}
              totalDocuments={totalDocuments}
              completeData={completeData}
              session={session!}
            />
          ) : (
            <TableSkeleton />
          )}
        </>
      )}
    </main>
  );
};

export default IBR;
