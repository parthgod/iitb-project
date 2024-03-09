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

const SingleLineDiagram = async ({ searchParams }: { searchParams: { query: string } }) => {
  const searchTerm = searchParams.query || "";
  const { data: defaultParams } = await getDefaultParams();
  const { data: singleLineDiagrams } = await getAllSingleLineDiagrams();

  const session = await getServerSession(authOptions);

  const filteredSingleLineDiagrams = searchTerm
    ? singleLineDiagrams.filter((item) => {
        return JSON.stringify(item).replace("additionalFields", "")?.toLowerCase().includes(searchTerm.toLowerCase());
      })
    : singleLineDiagrams;

  return (
    <main className="flex flex-col gap-3 w-full">
      <h1 className="text-4xl font-bold">Single Line Diagram</h1>
      <div className="flex justify-between items-center gap-5 mb-2">
        <Search />
        <div className="flex gap-5">
          <Link href="/singleLineDiagram/create">
            <Button>Create single line diagram</Button>
          </Link>
          {session?.user.isAdmin && <AddColumns />}
          {!session?.user.isAdmin && <RequestChange />}
        </div>
      </div>
      {defaultParams.length ? (
        <DisplayTable
          columns={defaultParams[0].singleLineDiagramsColumns}
          data={filteredSingleLineDiagrams}
          type="Single Line Diagram"
        />
      ) : (
        <TableSkeleton />
      )}
    </main>
  );
};

export default SingleLineDiagram;
