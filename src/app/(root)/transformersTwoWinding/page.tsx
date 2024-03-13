import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AddColumns from "@/components/AddColumns";
import DisplayTable from "@/components/DisplayTable";
import RequestChange from "@/components/RequestChange";
import Search from "@/components/Search";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { getAllTransformersTwoWindings } from "@/lib/actions/transformersTwoWinding.actions";
import { getServerSession } from "next-auth";
import Link from "next/link";

const TransformersTwoWinding = async ({
  searchParams,
}: {
  searchParams: { query: string; page?: number; limit?: number };
}) => {
  const searchTerm = searchParams?.query || "";
  const page = searchParams?.page || 1;
  const limit = searchParams?.limit || 10;
  const { data: defaultParams } = await getDefaultParams();
  const {
    data: transformersTwoWindings,
    totalPages,
    totalDocuments,
    completeData,
  } = await getAllTransformersTwoWindings(limit, page, searchTerm, defaultParams[0]?.transformersTwoWindingColumns);

  const session = await getServerSession(authOptions);

  const filteredtransformersTwoWindings = searchTerm
    ? transformersTwoWindings.filter((item) => {
        return JSON.stringify(item)
          .replace("additionalFields", "")
          .replace(
            new RegExp(defaultParams[0].transformersTwoWindingColumns.map((item) => item.field).join("|"), "g"),
            ""
          )
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
      })
    : transformersTwoWindings;

  return (
    <main className="flex flex-col gap-3 w-full">
      <h1 className="text-4xl font-bold p-3 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">Transformers Two Winding</h1>
      <div className="flex justify-between items-center gap-5 px-4 py-2 mt-2">
        <Search />
        <div className="flex gap-5">
          <Link href="/transformersTwoWinding/create">
            <Button>Create transformers two winding</Button>
          </Link>
          {session?.user.isAdmin && <AddColumns userId={session.user.id} />}
          {!session?.user.isAdmin && <RequestChange />}
        </div>
      </div>
      {defaultParams.length ? (
        <DisplayTable
          columns={defaultParams[0].transformersTwoWindingColumns}
          data={filteredtransformersTwoWindings}
          type="Transformers Two Winding"
          totalPages={totalPages}
          totalDocuments={totalDocuments}
          completeData={completeData}
        />
      ) : (
        <TableSkeleton />
      )}
    </main>
  );
};

export default TransformersTwoWinding;
