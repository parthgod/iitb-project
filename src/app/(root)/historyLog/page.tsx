import FilteredHistory from "@/components/FilteredHistory";
import PaginationComponent from "@/components/PaginationComponent";
import PrintModificationHistory from "@/components/PrintModificationHistory";
import { getAllModificationsHistory } from "@/lib/actions/modificationHistory.actions";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

const HistoryPage = async ({
  searchParams,
}: {
  searchParams: { type: string; databaseName: string; query: string; page?: number; limit?: number };
}) => {
  const type = searchParams.type || "";
  const databaseName = searchParams.databaseName || "";
  const query = searchParams.query || "";
  const page = searchParams?.page || 1;
  const limit = searchParams?.limit || 20;
  const totalEntries = (Number(page) - 1) * limit + limit;
  const {
    data: modificationHistory,
    totalDocuments,
    totalPages,
    completeData
  } = await getAllModificationsHistory({
    type: type,
    databaseName: databaseName,
    query: query,
    page,
    limit,
  });
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-4xl font-bold p-1.5">Edit history</h1>
      <FilteredHistory />
      {modificationHistory.length ? (
        <>
          <div>
            <PrintModificationHistory
              modificationHistory={modificationHistory}
              isAdmin={session?.user.isAdmin!}
              limit={limit}
              page={page}
              totalDocuments={totalDocuments}
              totalEntries={totalEntries}
              totalPages={totalPages}
              completeData={completeData}
            />
          </div>
        </>
      ) : (
        <p className="font-semibold whitespace-nowrap p-2">No records to display</p>
      )}
    </div>
  );
};

export default HistoryPage;
