import PaginationComponent from "@/components/PaginationComponent";
import PrintLoginRequests from "@/components/PrintLoginRequests";
import RequestsHeader from "@/components/RequestsHeader";
import { getAllLoginRequests } from "@/lib/actions/loginRequest.actions";

const LoginRequestsPage = async ({
  searchParams,
}: {
  searchParams: { query: string; status?: string; page?: number; limit?: number };
}) => {
  const query = searchParams.query || "";
  const status = searchParams.status || "";
  const page = searchParams?.page || 1;
  const limit = searchParams?.limit || 10;
  const totalEntries = (Number(page) - 1) * limit + limit;
  const { data: requests, totalPages, totalDocuments } = await getAllLoginRequests({ query, status, limit, page });

  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-4xl font-bold p-3">Login Requests</h1>
      <div className="px-3 pr-6">
        <RequestsHeader />
      </div>
      <div className="flex px-4 justify-between items-center mt-3">
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
          <PrintLoginRequests data={requests} />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default LoginRequestsPage;
