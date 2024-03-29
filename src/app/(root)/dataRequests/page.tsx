import { authOptions } from "@/lib/authOptions";
import PrintDataRequests from "@/components/PrintDataRequests";
import RequestsHeader from "@/components/RequestsHeader";
import { getAllDataRequests } from "@/lib/actions/dataRequest.actions";
import { getServerSession } from "next-auth";
import PaginationComponent from "@/components/PaginationComponent";

const RequestsPage = async ({
  searchParams,
}: {
  searchParams: { query: string; status?: string; page?: number; limit?: number };
}) => {
  const session = await getServerSession(authOptions);
  const query = searchParams.query || "";
  const status = searchParams.status || "";
  const page = searchParams?.page || 1;
  const limit = searchParams?.limit || 10;
  const totalEntries = (Number(page) - 1) * limit + limit;
  const {
    data: requests,
    totalDocuments,
    totalPages,
  } = await getAllDataRequests({
    query: session?.user.isAdmin ? query : session?.user.name!,
    status: status,
    limit,
    page,
  });

  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-4xl font-bold p-3">
        {session?.user.isAdmin ? "Users'" : "Your"} Requests for changes in data
      </h1>
      <div className="px-3 pr-6">{session?.user.isAdmin && <RequestsHeader />}</div>
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
      {requests.length ? (
        <div className="flex flex-col gap-4 h-[77vh] overflow-auto custom-scrollbar px-3">
          <PrintDataRequests
            requests={requests}
            isAdmin={session?.user.isAdmin!}
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default RequestsPage;
