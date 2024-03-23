import DisplayTable from "@/components/DisplayTable";
import RequestChange from "@/components/RequestChange";
import Search from "@/components/Search";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { getAllSeriesCapacitors } from "@/lib/actions/seriesCapacitor.actions";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import Link from "next/link";

const SeriesCapacitor = async ({
  searchParams,
}: {
  searchParams: { query: string; page?: number; limit?: number };
}) => {
  const searchTerm = searchParams?.query || "";
  const page = searchParams?.page || 1;
  const limit = searchParams?.limit || 10;
  const { data: defaultParams } = await getDefaultParams();
  const {
    data: seriesCapacitors,
    totalPages,
    totalDocuments,
    completeData,
  } = await getAllSeriesCapacitors(limit, page, searchTerm, defaultParams[0]?.seriesCapacitorColumns);

  const session = await getServerSession(authOptions);

  const filteredSeriesCapacitors = searchTerm
    ? seriesCapacitors.filter((item) => {
        return JSON.stringify(item)
          .replace("additionalFields", "")
          .replace(new RegExp(defaultParams[0].seriesCapacitorColumns.map((item) => item.field).join("|"), "g"), "")
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
      })
    : seriesCapacitors;

  return (
    <main className="flex flex-col w-full">
      <h1 className="text-4xl font-bold p-3">Series Capacitor</h1>
      <div className="flex justify-between items-center gap-5 px-4 py-2 mt-2">
        <Search />
        <div className="flex gap-5">
          <Link href="/seriesCapacitor/create">
            <Button>Create series capacitor</Button>
          </Link>
          {!session?.user.isAdmin && <RequestChange userId={session?.user.id!} />}
        </div>
      </div>
      {defaultParams.length ? (
        <DisplayTable
          columns={defaultParams[0].seriesCapacitorColumns}
          data={filteredSeriesCapacitors}
          type="Series Capacitor"
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

export default SeriesCapacitor;
