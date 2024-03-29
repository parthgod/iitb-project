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
  const limit = searchParams?.limit || 10;
  const totalEntries = (Number(page) - 1) * limit + limit;
  const {
    data: modificationHistory,
    totalDocuments,
    totalPages,
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
      <h1 className="text-4xl font-bold p-3">Edit history</h1>
      <FilteredHistory />
      <div className="flex px-4 justify-between items-center mt-3 mb-1">
        {totalDocuments ? (
          <p className="font-semibold whitespace-nowrap">
            Showing {(Number(page) - 1) * limit + 1} - {totalEntries > totalDocuments ? totalDocuments : totalEntries}{" "}
            of {totalDocuments} records
          </p>
        ) : (
          <p className="font-semibold whitespace-nowrap">No records to display</p>
        )}
        <PaginationComponent
          limit={limit}
          totalDocuments={totalDocuments}
          totalPages={totalPages}
        />
      </div>
      {modificationHistory.length ? (
        <>
          <div className="flex flex-col gap-4 h-[77vh] overflow-auto custom-scrollbar px-3 pr-4 pb-2">
            <PrintModificationHistory
              modificationHistory={modificationHistory}
              isAdmin={session?.user.isAdmin!}
            />
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default HistoryPage;
