import DisplayTable from "@/components/DisplayTable";
import RequestChange from "@/components/RequestChange";
import Search from "@/components/Search";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { getAllTransformersTwoWindings } from "@/lib/actions/transformersTwoWinding.actions";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { FaPlus } from "react-icons/fa6";

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
    <main className="flex flex-col w-full">
      <h1 className="text-4xl font-bold p-3">Transformers Two Winding</h1>
      <div className="flex justify-between items-center gap-5 px-4 py-2 mt-2">
        <Search />
        <div className="flex gap-5">
          <Link href="/transformersTwoWinding/create">
            <Button>
              Create transformers two winding <FaPlus className="text-lg ml-2" />
            </Button>
          </Link>
          {!session?.user.isAdmin && <RequestChange userId={session?.user.id!} />}
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
          session={session!}
          page={page}
        />
      ) : (
        <TableSkeleton />
      )}
    </main>
  );
};

export default TransformersTwoWinding;
