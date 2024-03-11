import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AddColumns from "@/components/AddColumns";
import DisplayTable from "@/components/DisplayTable";
import RequestChange from "@/components/RequestChange";
import Search from "@/components/Search";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { getAllTransformersThreeWindings } from "@/lib/actions/transformersThreeWinding.actions";
import { getServerSession } from "next-auth";
import Link from "next/link";

const TransformersThreeWinding = async ({ searchParams }: { searchParams: { query: string } }) => {
  const searchTerm = searchParams.query || "";
  const { data: defaultParams } = await getDefaultParams();
  const { data: transformersThreeWindings } = await getAllTransformersThreeWindings();

  const session = await getServerSession(authOptions);

  const filteredTransformersThreeWindings = searchTerm
    ? transformersThreeWindings.filter((item) => {
        return JSON.stringify(item)
          .replace("additionalFields", "")
          .replace(
            new RegExp(defaultParams[0].transformersThreeWindingColumns.map((item) => item.field).join("|"), "g"),
            ""
          )
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
      })
    : transformersThreeWindings;

  return (
    <main className="flex flex-col gap-3 w-full">
      <h1 className="text-4xl font-bold">Transformers Three Winding</h1>
      <div className="flex justify-between items-center gap-5 mb-2">
        <Search />
        <div className="flex gap-5">
          <Link href="/transformersThreeWinding/create">
            <Button>Create transformers three winding</Button>
          </Link>
          {session?.user.isAdmin && <AddColumns userId={session.user.id} />}
          {!session?.user.isAdmin && <RequestChange />}
        </div>
      </div>
      {defaultParams.length ? (
        <DisplayTable
          columns={defaultParams[0].transformersThreeWindingColumns}
          data={filteredTransformersThreeWindings}
          type="Transformers Three Winding"
        />
      ) : (
        <TableSkeleton />
      )}
    </main>
  );
};

export default TransformersThreeWinding;
