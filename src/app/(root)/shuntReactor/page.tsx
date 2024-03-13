import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AddColumns from "@/components/AddColumns";
import DisplayTable from "@/components/DisplayTable";
import RequestChange from "@/components/RequestChange";
import Search from "@/components/Search";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { getAllShuntReactors } from "@/lib/actions/shuntReactor.actions";
import { getServerSession } from "next-auth";
import Link from "next/link";

const ShuntReactors = async ({ searchParams }: { searchParams: { query: string; page?: number; limit?: number } }) => {
  const searchTerm = searchParams?.query || "";
  const page = searchParams?.page || 1;
  const limit = searchParams?.limit || 10;
  const { data: defaultParams } = await getDefaultParams();
  const {
    data: shuntReactors,
    totalPages,
    totalDocuments,
    completeData,
  } = await getAllShuntReactors(limit, page, searchTerm, defaultParams[0]?.shuntReactorsColumns);

  const session = await getServerSession(authOptions);

  const filteredShuntReactors = searchTerm
    ? shuntReactors.filter((item) => {
        return JSON.stringify(item)
          .replace("additionalFields", "")
          .replace(new RegExp(defaultParams[0].shuntReactorsColumns.map((item) => item.field).join("|"), "g"), "")
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
      })
    : shuntReactors;

  return (
    <main className="flex flex-col gap-3 w-full">
      <h1 className="text-4xl font-bold p-3 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">Shunt Reactors</h1>
      <div className="flex justify-between items-center gap-5 px-4 py-2 mt-2">
        <Search />
        <div className="flex gap-5">
          <Link href="/shuntReactor/create">
            <Button>Create shunt reactor</Button>
          </Link>
          {session?.user.isAdmin && <AddColumns userId={session.user.id} />}
          {!session?.user.isAdmin && <RequestChange />}
        </div>
      </div>
      {defaultParams.length ? (
        <DisplayTable
          columns={defaultParams[0].shuntReactorsColumns}
          data={filteredShuntReactors}
          type="Shunt Reactor"
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

export default ShuntReactors;
