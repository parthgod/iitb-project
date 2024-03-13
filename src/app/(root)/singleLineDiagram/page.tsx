import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AddColumns from "@/components/AddColumns";
import DisplayTable from "@/components/DisplayTable";
import RequestChange from "@/components/RequestChange";
import Search from "@/components/Search";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { getAllSingleLineDiagrams } from "@/lib/actions/singleLineDiagram.actions";
import { getServerSession } from "next-auth";
import Link from "next/link";

const SingleLineDiagram = async ({
  searchParams,
}: {
  searchParams: { query: string; page?: number; limit?: number };
}) => {
  const searchTerm = searchParams?.query || "";
  const page = searchParams?.page || 1;
  const limit = searchParams?.limit || 10;
  const { data: defaultParams } = await getDefaultParams();
  const {
    data: singleLineDiagrams,
    totalPages,
    totalDocuments,
    completeData,
  } = await getAllSingleLineDiagrams(limit, page, searchTerm, defaultParams[0]?.singleLineDiagramsColumns);

  const session = await getServerSession(authOptions);

  const filteredSingleLineDiagrams = searchTerm
    ? singleLineDiagrams.filter((item) => {
        return JSON.stringify(item)
          .replace("additionalFields", "")
          .replace(new RegExp(defaultParams[0].singleLineDiagramsColumns.map((item) => item.field).join("|"), "g"), "")
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
      })
    : singleLineDiagrams;

  return (
    <main className="flex flex-col gap-3 w-full">
      <h1 className="text-4xl font-bold p-3">Single Line Diagram</h1>
      <div className="flex justify-between items-center gap-5 px-4 py-2 mt-2">
        <Search />
        <div className="flex gap-5">
          <Link href="/singleLineDiagram/create">
            <Button>Create single line diagram</Button>
          </Link>
          {session?.user.isAdmin && <AddColumns userId={session.user.id} />}
          {!session?.user.isAdmin && <RequestChange userId={session?.user.id!} />}
        </div>
      </div>
      {defaultParams.length ? (
        <DisplayTable
          columns={defaultParams[0].singleLineDiagramsColumns}
          data={filteredSingleLineDiagrams}
          type="Single Line Diagram"
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

export default SingleLineDiagram;
